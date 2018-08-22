// imports necessary packages for the bbr requests page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { database } from 'firebase';
import { Needs } from '../../models/needs';
import { Profile } from '../../models/profile';
import { ProfileDonorPage } from '../profile-donor/profile-donor';
import { Notifications } from '../../models/notifications';

@IonicPage()
@Component({
  selector: 'page-bbr-requests',
  templateUrl: 'bbr-requests.html',
})
export class BbrRequestsPage {

  bbrRequestsRef$: AngularFireList<any>;
  bbrRequestsData: any;
  requests = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {
  }

  async ionViewWillEnter() {

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    try {

      // Get details of enrolled users
      this.bbrRequestsRef$ = this.afDatabase.list<string>('BBRrequests');
      await this.bbrRequestsRef$.valueChanges().subscribe(data => {
        this.requests = [];
        this.bbrRequestsData = data;
        for (let requester of this.bbrRequestsData) {
          var name;
          var profileUrl;
          this.afDatabase.object<Profile>(`Profile/${requester}`).valueChanges().subscribe(profile => {
            profileUrl = profile.profilepicture;
            name = profile.firstname
            this.requests.push({ "userId": requester, "profileUrl": profileUrl, "name": name });
          });
        };
      });

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

  confirm_the_req(userId: string) {

    // Show alert before sending the request
    let alert = this.alertCtrl.create({
      title: 'Confirm Request',
      message: 'Are you okay to accept the request?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Reject',
          handler: () => {
            this.reject_request(userId);
          }
        },
        {
          text: 'Accept',
          handler: () => {
            this.accept_request(userId);
          }
        }
      ]
    });
    alert.present();

  }

  async reject_request(userId: string) {

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    // Delete current request from request list
    this.afDatabase.object<string>(`BBRrequests/${userId}`).remove();
    loader.dismiss();

    // Show the toast message
    let toast = this.toastCtrl.create({
      message: "The request has been rejected",
      duration: 5000,
      position: "top",
      cssClass: "success_toast"
    });
    toast.present();
  }

  async accept_request(userId: string) {

    // change the user from donor to bbr
    this.afDatabase.object<string>(`Profile/${userId}/userrole`).set("bbr");

    // Delete current request from request list
    this.afDatabase.object<string>(`BBRrequests/${userId}`).remove();

  }

}
