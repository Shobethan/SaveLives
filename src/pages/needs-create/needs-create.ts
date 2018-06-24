// imports necessary packages for the needs-create page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Needs } from '../../models/needs';

@IonicPage()
@Component({
  selector: 'page-needs-create',
  templateUrl: 'needs-create.html',
})

export class NeedsCreatePage {

  need = {} as Needs;
  needRef$: AngularFireList<Needs>;
  city = "";
  desc = "";
  needid = "";

  today = new Date().toISOString();

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

  // create new need in firebase database or show error toast message for any errors
  async create(need: Needs) {

    // since these fields are not required if they empty assign null value to them
    this.need.city = this.need.city || this.city;
    this.need.desc = this.need.desc || this.desc;
    this.need.needid = this.needid;

    // get current user uid and assign it to need's userid
    this.need.userid = this.afAuth.auth.currentUser.uid;

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    try {

      // try creating new need array
      this.needRef$ = this.afDatabase.list('Needs');
      var key = await this.needRef$.push(this.need).key;
      this.need.needid = key;
      await this.afDatabase.list(`Needs`).update(key, { needid: key })
        .then(() => loader.dismiss())
        .then(() => this.navCtrl.pop());

      // show toast message of successful creation of need
      let toast = this.toastCtrl.create({
        message: "Your blood request thread has been created",
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
