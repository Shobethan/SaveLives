// imports necessary packages for the needs page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Notifications } from '../../models/notifications';
import { NeedsSinglePage } from '../needs-single/needs-single';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})

export class NotificationsPage {

  notificationsRef$: AngularFireList<Notifications[]>;
  notificationsData: any;

  notificationsRef2$: any;

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

      // Get current user's Id
      var userId = this.afAuth.auth.currentUser.uid;

      // try to get notifications list from firebase database
      this.notificationsRef$ = this.afDatabase.list<Notifications[]>(`Notifications/${userId}`, ref => ref.orderByChild('timestamp').limitToFirst(10));
      this.notificationsData = this.notificationsRef$.valueChanges();
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
    };
  };

  push__needs_single_page(notification: Notifications) {

    // Get current user's Id
    var userId = this.afAuth.auth.currentUser.uid;

    // try to update that the notification has been read
    this.notificationsRef2$ = this.afDatabase.list<Notifications>(`Notifications/${userId}`);
    this.notificationsRef2$.update(`${notification.userId}${notification.needId}`, {isRead: true});

    this.navCtrl.push(NeedsSinglePage, { needId: notification.needId });
  }

  make_the_notification_unread(notification: Notifications) {
    // Get current user's Id
    var userId = this.afAuth.auth.currentUser.uid;

    // try to update that the notification has been read
    this.notificationsRef2$ = this.afDatabase.list<Notifications>(`Notifications/${userId}`);
    this.notificationsRef2$.update(`${notification.userId}${notification.needId}`, {isRead: false});
  }

  make_the_notification_read(notification: Notifications) {
    // Get current user's Id
    var userId = this.afAuth.auth.currentUser.uid;

    // try to update that the notification has been read
    this.notificationsRef2$ = this.afDatabase.list<Notifications>(`Notifications/${userId}`);
    this.notificationsRef2$.update(`${notification.userId}${notification.needId}`, {isRead: true});
  }
}