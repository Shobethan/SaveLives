// imports necessary packages for the settings page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Nav } from 'ionic-angular';
import { AngularFireAuth} from 'angularfire2/auth';
import { WelcomePage } from '../welcome/welcome';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})

export class SettingsPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private afAuth: AngularFireAuth,
    public app: App) {
  }

  async logout() {
  await this.afAuth.auth.signOut();
  var nav = this.app.getRootNav();
  nav.setRoot(WelcomePage);
  }
}
