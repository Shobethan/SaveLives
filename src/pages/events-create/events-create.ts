// imports necessary packages for the events-create page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { storage } from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Events } from '../../models/events';

@IonicPage()
@Component({
  selector: 'page-events-create',
  templateUrl: 'events-create.html',
})

export class EventsCreatePage {

  event = {} as Events;
  eventsRef$: AngularFireList<Events>;
  desc = "";
  eventId = "";
  imageId = Math.random().toString(36).substr(2, 30);

  imageUrlDefault = "https://firebasestorage.googleapis.com/v0/b/ucscsavelives.appspot.com/o/default_event.png?alt=media&token=6098191e-4c6b-4c2e-931a-7a0f1249be11"
  imageUrlNew: boolean;
  imageUrl: string;

  today = new Date().toISOString();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afDatabase: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private camera: Camera) {
    this.imageUrl = this.imageUrlDefault;
    if (this.imageUrl == this.imageUrlDefault) {
      this.imageUrlNew = false;
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
  blank_create() {
    let toast = this.toastCtrl.create({
      message: "Please fill all the necessary fields",
      duration: 3000,
      position: "top",
      cssClass: "error_toast"
    });
    toast.present();
  }

  async openGallery() {
    try {

      // Defining camera options
      const options: CameraOptions = {
        quality: 100,
        targetHeight: 1200,
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
      const pictures = storage().ref(`EventsImages/${userId}/${this.imageId}`);
      pictures.putString(image, 'data_url').then(savedPic => {
        this.imageUrl = savedPic.downloadURL;
        this.imageUrlNew = true;
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
      const tempRef = storage().ref(`EventsImages/${userId}/${this.imageId}`);
      tempRef.delete();
      this.imageUrl = this.imageUrlDefault;
      this.imageUrlNew = false;
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

  // create new event in firebase database or show error toast message for any errors
  async create(event: Events) {

    // since desc field is not required if it is empty assign null value to it
    this.event.desc = this.event.desc || this.desc;

    this.event.eventId = this.eventId;
    this.event.imageId = this.imageId;
    this.event.imageUrl = this.imageUrl;

    // get current user uid and assign it to event's ownerId
    this.event.ownerId = this.afAuth.auth.currentUser.uid;

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    try {

      // try creating new need array
      this.eventsRef$ = this.afDatabase.list('Events');
      var key = await this.eventsRef$.push(this.event).key;
      this.event.eventId = key;
      await this.afDatabase.list('Events').update(key, { eventId: key })
        .then(() => loader.dismiss())
        .then(() => this.navCtrl.pop());

      // show toast message of successful creation of need
      let toast = this.toastCtrl.create({
        message: "Your event has been created",
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
