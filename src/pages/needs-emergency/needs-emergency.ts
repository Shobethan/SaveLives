// imports necessary packages for the needs emergency page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
// import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Needs } from '../../models/needs';
import { NeedsSinglePage } from '../needs-single/needs-single';

@IonicPage()
@Component({
  selector: 'page-needs-emergency',
  templateUrl: 'needs-emergency.html',
})

export class NeedsEmergencyPage {

  needEmergencyRef$: AngularFireList<Needs[]>;
  needEmergencyData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afDatabase: AngularFireDatabase,
    // private afAuth: AngularFireAuth,
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
      this.needEmergencyRef$ = this.afDatabase.list<Needs[]>('Needs', ref => ref.orderByChild('needbefore'));
      this.needEmergencyData = this.needEmergencyRef$.valueChanges().take(1);
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

  doRefresh(refresher) {

    // try to get emergency needs list from firebase database
    this.needEmergencyRef$ = this.afDatabase.list<Needs[]>('Needs', ref => ref.orderByChild('needbefore'));
    this.needEmergencyData = this.needEmergencyRef$.valueChanges().take(1);
    refresher.complete();
  }

  push__needs_single_page(needEmg: Needs) {
    this.navCtrl.push(NeedsSinglePage, { needId: needEmg.needid });
  }

}
