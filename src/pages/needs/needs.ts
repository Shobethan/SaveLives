// imports necessary packages for the needs page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import { Needs } from '../../models/needs';

import { NeedsCreatePage } from "../needs-create/needs-create";
import { NeedsEmergencyPage } from '../needs-emergency/needs-emergency';
import { NeedsSinglePage } from '../needs-single/needs-single';
import { NotificationsPage } from '../notifications/notifications';
import { Notifications } from '../../models/notifications';
import { Profile } from '../../models/profile';

@IonicPage()
@Component({
  selector: 'page-needs',
  templateUrl: 'needs.html',
})

export class NeedsPage {

  profileRef$: AngularFireObject<Profile>;
  profileData: any;
  isDonor: Boolean = true;
  isBBR: Boolean = false;
  isAdmin: Boolean = false;
  needEmergencyRef$: AngularFireList<Needs[]>;
  needEmergencyData: any;
  needNearbyRef$: AngularFireList<Needs[]>;
  needNearbyData: any;

  notificationsCount: number;

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

      await this.afDatabase.list<Notifications[]>(`Notifications/${userId}`, ref => ref.orderByChild('isRead').equalTo(false)).valueChanges().subscribe(data => this.notificationsCount = data.length);

      this.profileRef$ = this.afDatabase.object<Profile>(`Profile/${userId}`);
      this.profileData = this.profileRef$.valueChanges().subscribe(data => {
        if (data.userrole == "admin") {
          this.isAdmin = true;
          this.isBBR = true;
          this.isDonor = true;
        } else if (data.userrole == "bbr") {
          this.isAdmin = false;
          this.isBBR = true;
          this.isDonor = true;
        } else if (data.userrole == "donor") {
          this.isAdmin = false;
          this.isBBR = false;
          this.isDonor = true;
        }
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

  // push notifications page on the top of this page
  push__notifications_page() {
    this.navCtrl.push(NotificationsPage);
  }

  // push needs create page on the top of this page
  push__needs_create_page() {
    this.navCtrl.push(NeedsCreatePage);
  }

  // push needs emergency page on the top of this page
  push__needs_emergency_page() {
    this.navCtrl.push(NeedsEmergencyPage);
  }

  // push needs single page on the top of this page
  push__needs_single_page(need: Needs) {
    this.navCtrl.push(NeedsSinglePage, { needId: need.needid });
  }
}
