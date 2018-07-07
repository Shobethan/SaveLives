// imports necessary packages for the profile page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Profile } from '../../models/profile';

import { ProfileEditPage } from '../profile-edit/profile-edit';

@IonicPage()
@Component({
  selector: 'page-profile-donor',
  templateUrl: 'profile-donor.html',
})

export class ProfileDonorPage {

  profile = {} as Profile;
  profileRef$: AngularFireObject<Profile>;
  profileData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private loadCtrl: LoadingController, 
    private toastCtrl: ToastController) {
  }

  ionViewWillEnter() {

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    try {

      // Capture the userId as a Navparameter
    const userId = this.navParams.get('userId');

      // try to get profile details from firebase database
      this.profileRef$ = this.afDatabase.object<Profile>(`Profile/${userId}`);
      this.profileData = this.profileRef$.valueChanges();
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
}
