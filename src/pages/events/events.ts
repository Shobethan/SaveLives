import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AddeventPage } from '../addevent/addevent';
import { Events } from '../../models/events';
import { EventsCreatePage } from '../events-create/events-create';

@IonicPage()
@Component({
	selector: 'page-events',
	templateUrl: 'events.html',
})
export class EventsPage {

	eventsRef$: AngularFireList<Events[]>;
	eventsData: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private afAuth: AngularFireAuth,
		private afDatabase: AngularFireDatabase,
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

			// try to get events details from firebase database
			this.eventsRef$ = this.afDatabase.list<Events[]>('Events');
			this.eventsData = this.eventsRef$.valueChanges();
			loader.dismiss();
		}

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
		}
	}

	push__events_create_page() {
		this.navCtrl.push(EventsCreatePage);
	}
}