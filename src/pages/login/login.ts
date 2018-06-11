// imports necessary packages for the login page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';

import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController) {
  }

  // show error toast message for blank required fields
  blank_login() {
    let toast = this.toastCtrl.create({
      message: "Please fill all the fields",
      duration: 3000,
      position: "top",
      cssClass: "error_toast"
    });
    toast.present();
  }

  // login the user into the app or show error toast message for errors
  async login(user: User) {

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();

    try {
      
      // try login with email and password
      await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      loader.dismiss();
      this.navCtrl.setRoot(TabsPage);

      // show toast message of successful login
      let toast = this.toastCtrl.create({
        message: "You have successfully logged in",
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

      // make password field empty
      user.password = "";
    }
  }

  // navigate to register page
  set_register_page() {
    this.navCtrl.setRoot(RegisterPage);
  }
}