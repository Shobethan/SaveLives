// imports necessary packages for the needs page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { Needs } from '../../models/needs';

import { NeedsCreatePage } from "../needs-create/needs-create";

@IonicPage()
@Component({
  selector: 'page-needs',
  templateUrl: 'needs.html',
})

export class NeedsPage {

  profileData: any;
  needEmergencyRef$: AngularFireList<Needs[]>;
  needEmergencyData: any;
  needNearbyRef$: AngularFireList<Needs[]>;
  needNearbyData: any;

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

      // try to get emergency needs list from firebase database
      this.needEmergencyRef$ = this.afDatabase.list<Needs[]>('Needs', ref => ref.orderByChild('needbefore').limitToFirst(4));
      this.needEmergencyData = this.needEmergencyRef$.valueChanges().take(1);

      // try to get nearby needs list from firebase database
      var userId = this.afAuth.auth.currentUser.uid;
      // await this.afDatabase.object<string>(`Profile/${this.userId}/district`).valueChanges().take(1).subscribe(District => this.userCurDistrict = District);
      await this.afDatabase.object<string>(`Profile/${userId}/district`).valueChanges().take(1).subscribe(District => {
        this.needNearbyRef$ = this.afDatabase.list<Needs[]>('Needs', ref => ref.orderByChild("district").equalTo(District).limitToFirst(4));
        this.needNearbyData = this.needNearbyRef$.valueChanges().take(1);
      });
      loader.dismiss();
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

  // push needs create page on the top of this page
  push__needs_create_page() {
    this.navCtrl.push(NeedsCreatePage);
  }
}
