// imports necessary packages for the welcome page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})

export class WelcomePage {
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  // navigate to register page
  set_register_page() {
    this.navCtrl.setRoot(RegisterPage);
  }

  // navigate to login page
  set_login_page() {
    this.navCtrl.setRoot(LoginPage);
  }  
}
