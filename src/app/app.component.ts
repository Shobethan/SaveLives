// imports necessary packages for the app
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { timer } from 'rxjs/observable/timer';

import { WelcomePage } from '../pages/welcome/welcome';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage:any = WelcomePage;

  // showSplash = true;
  showSplash = false;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen) {
      platform.ready().then(() => {
        statusBar.styleDefault();
        splashScreen.hide();

        timer(3000).subscribe(() => this.showSplash = false)
      }
    );
  }
}