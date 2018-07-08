// imports necessary packages for the settings page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { WelcomePage } from '../welcome/welcome';

import { NeedsEnrolledPage } from '../needs-enrolled/needs-enrolled';
import { NeedsCreatedPage } from '../needs-created/needs-created';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})

export class SettingsPage {

  isDonor: Boolean = false;
  isBBR: Boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    public app: App) {
  }

  async logout() {
    await this.afAuth.auth.signOut()
      .then(() => {
        var nav = this.app.getRootNav();
        nav.setRoot(WelcomePage);
      })
  }

  // push needs enrolled page on the top of this page
  push__needs_enrolled_page() {
    this.navCtrl.push(NeedsEnrolledPage);
  }

  // push needs created page on the top of this page
  push__needs_created_page() {
    this.navCtrl.push(NeedsCreatedPage);
  }
}
