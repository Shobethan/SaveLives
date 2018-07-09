import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AddeventPage } from '../addevent/addevent';
import { Events } from '../../models/events';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
	event = {} as Events;
	eventRef$: AngularFireList<Events[]>;
	eventData: any;
	
 constructor(
	public navCtrl: NavController, 
	public navParams: NavParams,
	private afAuth: AngularFireAuth,
	private afDatabase : AngularFireDatabase,
	private loadCtrl: LoadingController) {
  }
  
	async ionViewWillEnter() {

    // show the loader
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
      content: "Please wait..."
    });
    loader.present();
	
	try {

      // try to get profile details from firebase database
      //var userId = this.afAuth.auth.currentUser.uid;
      this.eventRef$ = this.afDatabase.list<Events[]>('Events');
      this.eventData = this.eventRef$.valueChanges();
	  console.log(this.eventData);
      loader.dismiss();

      
    }
	
	catch (e) {
		console.log(e);
	}
  }

	push__add_event_page() {
	this.navCtrl.push(AddeventPage);
	}
}