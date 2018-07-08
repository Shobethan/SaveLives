// imports necessary packages for the needs created page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { database } from 'firebase';
import { Needs } from '../../models/needs';
import { NeedsSinglePage } from '../needs-single/needs-single';

@IonicPage()
@Component({
  selector: 'page-needs-created',
  templateUrl: 'needs-created.html',
})

export class NeedsCreatedPage {

  needsRef$: AngularFireList<Needs[]>;
  needsData: any;

  isEnrolled: Boolean;

  enrolledNeedsData = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afDatabase: AngularFireDatabase,
    private afAuth: AngularFireAuth,
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

      // Get the current userId
      var userId = this.afAuth.auth.currentUser.uid;

      // Find all the needId of the needs which current user enrolled
      var ref = database().ref('Needs').orderByKey();
      var check = ref.once("value")
        .then(function (snapshot) {
          var enrolledNeedsData = [];
          snapshot.forEach(function (childSnapshot) {
            if ( userId == childSnapshot.child('userid').val()) {
              enrolledNeedsData.push(childSnapshot.val());
            };
          });
          return enrolledNeedsData;
        });
      check.then(enrolledNeedsData => {
        this.enrolledNeedsData = enrolledNeedsData;
        loader.dismiss();
      });
    }

    // catch and show errors via toast message only if any errors occur
    catch (e) {
      loader.dismiss();
      console.log(e);

      let toast = this.toastCtrl.create({
        message: e,
        duration: 5000,
        position: "top",
        cssClass: "error_toast"
      });
      toast.present();
    }
  }

  push__needs_single_page(need: Needs) {
    this.navCtrl.push(NeedsSinglePage, { needId: need.needid });
  }

}
