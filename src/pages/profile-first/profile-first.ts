// imports necessary packages for the profile-first page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase } from 'angularfire2/database';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { storage } from 'firebase';
import { Profile } from '../../models/profile';

import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-profile-first',
  templateUrl: 'profile-first.html',
})

export class ProfileFirstPage {

  profile = {} as Profile;

  profilePictureDefault = "https://firebasestorage.googleapis.com/v0/b/ucscsavelives.appspot.com/o/default_dp.png?alt=media&token=757bc6fb-3db0-4b31-925f-16749689e82e"
  profilePictureNew: boolean = false;
  profilePictureUrl: string;

  lastname = "";
  phone = "";
  bio = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private afDatabase: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController) {
    this.profilePictureUrl = this.profilePictureDefault;
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

  // Auto change the text area height according to the content typing
  protected adjustTextarea(event: any): void {
    let textarea: any = event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    return;
  }

  // show error toast message for blank required fields
  blank_save() {
    let toast = this.toastCtrl.create({
      message: "Please fill all the necessary fields",
      duration: 3000,
      position: "top",
      cssClass: "error_toast"
    });
    toast.present();
  }

  // save profile details of the user in firebase database or show error toast message for any errors
  async save(profile: Profile) {

    // since these fields are not required if they empty assign null value to them
    this.profile.lastname = this.profile.lastname || this.lastname;
    this.profile.bio = this.profile.bio || this.bio;
    this.profile.phone = this.profile.phone || this.phone;
    this.profile.userrole = "donor";

    this.profile.profilepicture = this.profilePictureUrl;

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    try {

      // try saving only one profile details array under particular uid of the user
      await this.afAuth.authState.take(1).subscribe(auth => {
        this.afDatabase.object(`Profile/${auth.uid}`)
          .set(this.profile)
          .then(() => loader.dismiss())
          .then(() => this.navCtrl.setRoot(TabsPage));
      })

      // show toast message of successful profile save
      let toast = this.toastCtrl.create({
        message: "Welcome to SAVE LIVES",
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