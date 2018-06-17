// imports necessary packages for the profile edit page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { storage } from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Profile } from '../../models/profile';

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})

export class ProfileEditPage {

  profilePictureDefault = "https://firebasestorage.googleapis.com/v0/b/ucscsavelives.appspot.com/o/default_dp.png?alt=media&token=757bc6fb-3db0-4b31-925f-16749689e82e"
  profilePictureNew: boolean;
  profilePictureUrl: string;

  profile = {} as Profile;
  profileRef$: AngularFireObject<Profile>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private afDatabase: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController) {
    this.profilePictureUrl = this.profilePictureDefault;
    if (this.profilePictureUrl == this.profilePictureDefault) {
      this.profilePictureNew = false;
    }
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
    profileData.subscribe(profile => {
      this.profile = profile;
      this.profilePictureUrl = profile.profilepicture;
      if (this.profilePictureUrl != this.profilePictureDefault) {
        this.profilePictureNew = true;
      }
    });
  }

  async openCamera() {
    try {

      // Defining camera options
      const options: CameraOptions = {
        quality: 100,
        targetHeight: 500,
        targetWidth: 500,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.CAMERA,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        allowEdit: true
      }

      const result = await this.camera.getPicture(options);

      // show the loader
      var loader = this.loadCtrl.create({
        spinner: "bubbles",
        content: "Please wait..."
      });
      loader.present();

      const image = `data:image/png;base64,${result}`;
      var userId = this.afAuth.auth.currentUser.uid;
      const pictures = storage().ref(`ProfilePictures/${userId}`);
      pictures.putString(image, 'data_url').then(savedPic => {
        this.profilePictureUrl = savedPic.downloadURL;
        this.profilePictureNew = true;
        loader.dismiss();
      });
    }

    catch (e) {
      let toast = this.toastCtrl.create({
        message: e,
        duration: 5000,
        position: "top",
        cssClass: "error_toast"
      });
      toast.present();
    }
  }

  async openGallery() {
    try {

      // Defining camera options
      const options: CameraOptions = {
        quality: 100,
        targetHeight: 500,
        targetWidth: 500,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        allowEdit: true
      }

      const result = await this.camera.getPicture(options);

      // show the loader
      var loader = this.loadCtrl.create({
        spinner: "bubbles",
        content: "Please wait..."
      });
      loader.present();

      const image = `data:image/png;base64,${result}`;
      var userId = this.afAuth.auth.currentUser.uid;
      const pictures = storage().ref(`ProfilePictures/${userId}`);
      pictures.putString(image, 'data_url').then(savedPic => {
        this.profilePictureUrl = savedPic.downloadURL;
        this.profilePictureNew = true;
        loader.dismiss();
      });
    }

    catch (e) {
      let toast = this.toastCtrl.create({
        message: e,
        duration: 5000,
        position: "top",
        cssClass: "error_toast"
      });
      toast.present();
    }
  }

  deletePhoto() {

    try {
      var userId = this.afAuth.auth.currentUser.uid;
      const tempRef = storage().ref(`ProfilePictures/${userId}`);
      tempRef.delete();
      this.profilePictureUrl = this.profilePictureDefault;
      this.profilePictureNew = false;
    }

    catch (e) {
      let toast = this.toastCtrl.create({
        message: e,
        duration: 5000,
        position: "top",
        cssClass: "error_toast"
      });
      toast.present();
    }
  }

  async save(profile: Profile) {

    this.profile.profilepicture = this.profilePictureUrl || this.profile.profilepicture;

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