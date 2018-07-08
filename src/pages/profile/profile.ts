// imports necessary packages for the profile page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Profile } from '../../models/profile';

import { ProfileEditPage } from '../profile-edit/profile-edit';
import { NotificationsPage } from '../notifications/notifications';

import { Notifications } from '../../models/notifications';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {

  profile = {} as Profile;
  profileRef$: AngularFireObject<Profile>;
  profileData: any;

  userEmail: string;

  notificationsCount: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private loadCtrl: LoadingController, 
    private toastCtrl: ToastController) {
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
      this.profileData = this.profileRef$.valueChanges();

      this.userEmail = this.afAuth.auth.currentUser.email;

      await this.afDatabase.list<Notifications[]>(`Notifications/${userId}`, ref => ref.orderByChild('isRead').equalTo(false)).valueChanges().subscribe(data => this.notificationsCount = data.length);
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

  // push notifications page on the top of this page
  push__notifications_page() {
    this.navCtrl.push(NotificationsPage);
  }

  // push profile edit page on the top of this page
  push__profile_edit_page() {
    this.navCtrl.push(ProfileEditPage);
  }
}
