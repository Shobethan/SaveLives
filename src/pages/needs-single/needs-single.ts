// imports necessary packages for the needs single page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, Alert } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { database } from 'firebase';
import { Needs } from '../../models/needs';

@IonicPage()
@Component({
  selector: 'page-needs-single',
  templateUrl: 'needs-single.html',
})

export class NeedsSinglePage {

  needRef$: AngularFireObject<Needs>;
  needData: any;

  enrollRef$: AngularFireObject<string>;

  hasEnrolled = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {
  }

  async ionViewWillEnter() {

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    try {

      // Capture the needId as a Navparameter
      const needId = this.navParams.get('needId');

      // try to get need details from firebase database
      this.needRef$ = await this.afDatabase.object<Needs>(`Needs/${needId}`);
      this.needData = await this.needRef$.valueChanges();
      loader.dismiss();

      // Get the current userId
      var userId = this.afAuth.auth.currentUser.uid;

      // Find whether the current user already enrolled to the need or not
      var ref = database().ref(`Needs/${needId}/enrolleddonors/${userId}`);
      var check = ref.once("value")
        .then(function (snapshot) {
          var hasEnrolled = snapshot.exists();
          return hasEnrolled;
        });
      check.then(hasEnrolled => this.hasEnrolled = hasEnrolled);
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

  enroll_alert() {

    // Show alert before confirm the enroll
    let alert = this.alertCtrl.create({
      title: 'Confirm Enroll',
      message: 'You are about to enroll to this thread.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Enroll',
          handler: () => {
            this.enroll();
          }
        }
      ]
    });
    alert.present();
  }

  async enroll() {

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    // Capture the needId as a Navparameter
    const needId = this.navParams.get('needId');

    // Get the current userId
    var userId = this.afAuth.auth.currentUser.uid;

    // Push current userId to enrolled donors list
    this.enrollRef$ = this.afDatabase.object<string>(`Needs/${needId}/enrolleddonors/${userId}`);
    await this.enrollRef$.set(userId)
      .then(() => this.hasEnrolled = true)
      .then(() => loader.dismiss());

    // Show the toast message
    let toast = this.toastCtrl.create({
      message: "You have successfully enrolled",
      duration: 5000,
      position: "top",
      cssClass: "success_toast"
    });
    toast.present();
  }

  unenroll_alert() {

    // Show alert before confirm the unenroll
    let alert = this.alertCtrl.create({
      title: 'Confirm Unenroll?',
      message: 'Do you really want to unenroll from this thread?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Unenroll',
          handler: () => {
            this.unenroll();
          }
        }
      ]
    });
    alert.present();
  }

  async unenroll() {

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    // Capture the needId as a Navparameter
    const needId = this.navParams.get('needId');

    // Get the current userId
    var userId = this.afAuth.auth.currentUser.uid;

    // Delete current userId from enrolled donors list
    this.enrollRef$ = this.afDatabase.object<string>(`Needs/${needId}/enrolleddonors/${userId}`);
    await this.enrollRef$.remove()
      .then(() => this.hasEnrolled = false)
      .then(() => loader.dismiss());

    // Show the toast message
    let toast = this.toastCtrl.create({
      message: "You have successfully unenrolled",
      duration: 5000,
      position: "top",
      cssClass: "success_toast"
    });
    toast.present();
  }
}
