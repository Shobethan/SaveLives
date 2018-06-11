// imports necessary packages for the register page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';

import { ProfileFirstPage } from '../profile-first/profile-first';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  user = {} as User;
  confirm_password = this.confirm_password;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  // show error toast message for blank required fields
  blank_register() {
    let toast = this.toastCtrl.create({
      message: "Please fill all the fields",
      duration: 3000,
      position: "top",
      cssClass: "error_toast"
    });
    toast.present();
  }

  // register the user and login the user into the app or show error toast message for errors
  async register(user: User, confirm_password: string) {

    if (user.password != confirm_password) {

      // show toast message of error
      let toast = this.toastCtrl.create({
        message: "Password & Confirm Password fields do not match",
        duration: 3000,
        position: "top",
        cssClass: "error_toast"
      });
      toast.present();

      // make password field and confirm password field empty
      user.password = "";
      this.confirm_password = "";
    }

    else {

      // show the loader
      var loader = this.loadCtrl.create({
        spinner: "bubbles",
        content: "Please wait..."
      });
      loader.present();

      try {

        // try register the user with email and password
        await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
        loader.dismiss();
        this.navCtrl.setRoot(ProfileFirstPage);

        // show toast message of successful registration
        let toast = this.toastCtrl.create({
          message: "You have successfully signed up",
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

        // make password field and confirm password field empty
        user.password = "";
        this.confirm_password = "";
      }
    }
  }

  // navigate to login page
  set_login_page() {
    this.navCtrl.setRoot(LoginPage);
  }
}