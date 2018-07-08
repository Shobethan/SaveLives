// imports necessary packages for the needs single page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { database } from 'firebase';
import { Needs } from '../../models/needs';
import { Profile } from '../../models/profile';
import { ProfileDonorPage } from '../profile-donor/profile-donor';

@IonicPage()
@Component({
  selector: 'page-needs-single',
  templateUrl: 'needs-single.html',
})

export class NeedsSinglePage {

  needRef$: AngularFireObject<Needs>;
  needData: any;

  enrollRef$: AngularFireObject<String>;

  enrolledRef$: AngularFireList<String>;
  enrolledData: any;

  profileRef$: AngularFireObject<Profile>;

  ownerName: String;
  ownerId: String;

  enrolledUsers = [];

  isOwner: Boolean = false;
  hasEnrolled: Boolean = false;
  isEligible: Boolean = false;
  hasEnrolledDonors: Boolean = false;

  subscriptions = [];

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

    this.enrolledUsers = [];

    try {

      // Capture the needId as a Navparameter
      const needId = this.navParams.get('needId');

      // try to get need details from firebase database
      this.needRef$ = await this.afDatabase.object<Needs>(`Needs/${needId}`);
      this.needData = await this.needRef$.valueChanges();

      // Get the current userId
      var userId = this.afAuth.auth.currentUser.uid;

      // Find whether the current user already enrolled to the need or not
      var ref = database().ref(`Needs/${needId}/enrolleddonors/${userId}`);
      var check = ref.once("value")
        .then(function (snapshot) {
          var hasEnrolled = snapshot.exists();
          return hasEnrolled;
        });
      check.then(hasEnrolled => this.hasEnrolled = hasEnrolled);

      // Find whether the current user's blood group and requested blood group are same or not
      var currentUserBloodGroup;
      var currentNeedBloodGroup;
      var currentUser = await this.afDatabase.object<Profile>(`Profile/${userId}`);
      let sub1 = currentUser.valueChanges().subscribe(userData => {
        currentUserBloodGroup = userData.bloodgroup;
        let sub2 = this.afDatabase.object<Needs>(`Needs/${needId}`).valueChanges().subscribe(needData => {
          currentNeedBloodGroup = needData.bloodgroup;
          if (currentUserBloodGroup == currentNeedBloodGroup) {
            this.isEligible = true;
          };
          this.subscriptions.push(sub2);
        });
      });
      this.subscriptions.push(sub1);

      // Find the ownerId and ownerName of the need
      let sub3 = await this.needRef$.valueChanges().subscribe(needDetails => {
        this.ownerId = needDetails.userid;
        let sub4 = this.afDatabase.object<Profile>(`Profile/${this.ownerId}`).valueChanges().subscribe(profile => this.ownerName = profile.firstname);
        this.subscriptions.push(sub4);
        // Find whether the owner and current user are the same or not
        if (userId == this.ownerId) {
          this.isOwner = true;
        };
      });
      this.subscriptions.push(sub3);

      // Get details of enrolled users
      this.enrolledRef$ = this.afDatabase.list<string>(`Needs/${needId}/enrolleddonors`);
      let sub5 = await this.enrolledRef$.valueChanges().subscribe(data => {
        this.enrolledData = data;
        for (let donor of this.enrolledData) {
          var profileUrl;
          let sub6 = this.afDatabase.object<Profile>(`Profile/${donor}`).valueChanges().subscribe(profile => {
            profileUrl = profile.profilepicture;
            this.enrolledUsers.push({ "userId": donor, "profileUrl": profileUrl });
          });
          this.subscriptions.push(sub6);
          if (this.enrolledUsers != []) {
            this.hasEnrolledDonors = true;
          };        
        };
      });
      this.subscriptions.push(sub5);      
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

  enroll_alert() {

    // Show alert before confirm the enroll
    let alert = this.alertCtrl.create({
      title: 'Confirm Enroll',
      message: 'You are about to enroll to this thread.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Enroll',
          handler: () => {
            this.enroll();
          }
        }
      ]
    });
    alert.present();
  }

  async enroll() {

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    // Capture the needId as a Navparameter
    const needId = this.navParams.get('needId');

    // Get the current userId
    var userId = this.afAuth.auth.currentUser.uid;

    // Push current userId to enrolled donors list
    this.enrollRef$ = this.afDatabase.object<string>(`Needs/${needId}/enrolleddonors/${userId}`);
    await this.enrollRef$.set(userId)
      .then(() => this.hasEnrolled = true)
      .then(() => loader.dismiss());

    // Show the toast message
    let toast = this.toastCtrl.create({
      message: "You have successfully enrolled",
      duration: 5000,
      position: "top",
      cssClass: "success_toast"
    });
    toast.present();
  }

  unenroll_alert() {

    // Show alert before confirm the unenroll
    let alert = this.alertCtrl.create({
      title: 'Confirm Unenroll?',
      message: 'Do you really want to unenroll from this thread?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Unenroll',
          handler: () => {
            this.unenroll();
          }
        }
      ]
    });
    alert.present();
  }

  async unenroll() {

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    // Capture the needId as a Navparameter
    const needId = this.navParams.get('needId');

    // Get the current userId
    var userId = this.afAuth.auth.currentUser.uid;

    // Delete current userId from enrolled donors list
    this.enrollRef$ = this.afDatabase.object<string>(`Needs/${needId}/enrolleddonors/${userId}`);
    await this.enrollRef$.remove()
      .then(() => this.hasEnrolled = false)
      .then(() => loader.dismiss());

    // Show the toast message
    let toast = this.toastCtrl.create({
      message: "You have successfully unenrolled",
      duration: 5000,
      position: "top",
      cssClass: "success_toast"
    });
    toast.present();
  }

  push__profile_donor_page(userId: String) {
    this.navCtrl.push(ProfileDonorPage, { userId: userId });
  }  

  ionViewDidLeave() {
    for (let sub of this.subscriptions) {
      console.log(sub);
      sub.unsubscribe();
    }
  }
}
