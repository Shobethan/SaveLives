// imports necessary packages for the settings page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { WelcomePage } from '../welcome/welcome';

import { NeedsEnrolledPage } from '../needs-enrolled/needs-enrolled';
import { NeedsCreatedPage } from '../needs-created/needs-created';
import { Profile } from '../../models/profile';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})

export class SettingsPage {

  profileRef$: AngularFireObject<Profile>;
  profileData: any;
  isDonor: Boolean = true;
  isBBR: Boolean = false;
  isAdmin: Boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public app: App) {
  }

  async logout() {
    await this.afAuth.auth.signOut()
      .then(() => {
        var nav = this.app.getRootNav();
        nav.setRoot(WelcomePage);
      })
  }

  async ionViewWillEnter() {
    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    try {

      // try to get profile details from firebase database
      var userId = this.afAuth.auth.currentUser.uid;
      this.profileRef$ = this.afDatabase.object<Profile>(`Profile/${userId}`);
      this.profileData = this.profileRef$.valueChanges().subscribe(data => {
        if (data.userrole == "admin") {
          this.isAdmin = true;
          this.isBBR = true;
          this.isDonor = true;
        } else if (data.userrole == "bbr") {
          this.isAdmin = false;
          this.isBBR = true;
          this.isDonor = true;
        } else if (data.userrole == "donor") {
          this.isAdmin = false;
          this.isBBR = false;
          this.isDonor = true;
        }
      });
      loader.dismiss();
    }

    // catch and show errors via toast message only if any errors occur
    catch (e) {
      loader.dismiss();

      let toast = this.toastCtrl.create({
        message: e,
        duration: 5000,
        position: "top",
        cssClass: "error_toast"
      });
      toast.present();
    }
  }

  // push needs enrolled page on the top of this page
  push__needs_enrolled_page() {
    this.navCtrl.push(NeedsEnrolledPage);
  }

  // push needs created page on the top of this page
  push__needs_created_page() {
    this.navCtrl.push(NeedsCreatedPage);
  }

  send_bbr_request() {

    // Show alert before sending the request
    let alert = this.alertCtrl.create({
      title: 'Confirm Request',
      message: 'You are about to send a request to be a blood bank representative.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Request',
          handler: () => {
            this.send_request();
          }
        }
      ]
    });
    alert.present();
  }

  async send_request() {

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    try {

      // try to get profile details from firebase database
      var userId = this.afAuth.auth.currentUser.uid;

      // try to add bbr request
      await this.afDatabase.object(`BBRrequests/${userId}`).set(userId).then(() => loader.dismiss());

      // show toast message of successful profile save
      let toast = this.toastCtrl.create({
        message: "Your Request has been sent",
        duration: 3000,
        position: "top",
        cssClass: "success_toast"
      });
      toast.present();
    }

    // catch and show errors via toast message only if any errors occur
    catch (e) {
      loader.dismiss();

      let toast = this.toastCtrl.create({
        message: e,
        duration: 5000,
        position: "top",
        cssClass: "error_toast"
      });
      toast.present();
    }
  }
}
