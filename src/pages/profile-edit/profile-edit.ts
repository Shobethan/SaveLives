// imports necessary packages for the profile edit page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Profile } from '../../models/profile';

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})

export class ProfileEditPage {

  profile = {} as Profile;
  profileRef$: AngularFireObject<Profile>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afDatabase: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  // Auto change the text area height according to the content typing
  protected adjustTextarea(event: any): void {
    let textarea: any = event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    return;
  }

  ionViewWillEnter() {
    var userId = this.afAuth.auth.currentUser.uid;
    this.profileRef$ = this.afDatabase.object<Profile>(`Profile/${userId}`);
    var profileData = this.profileRef$.valueChanges();
    profileData.subscribe(profile => this.profile = profile);
  }

  async save(profile: Profile) {

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    try {

      // try to update the profile details
      await this.profileRef$.update(profile);
      loader.dismiss()
      this.navCtrl.pop();

      // show toast message of successful profile update
      let toast = this.toastCtrl.create({
        message: "Your profile has been updated",
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