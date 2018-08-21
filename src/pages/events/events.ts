import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Events } from '../../models/events';
import { EventsCreatePage } from '../events-create/events-create';
import { NotificationsPage } from '../notifications/notifications';
import { Notifications } from '../../models/notifications';
import { Profile } from '../../models/profile';

@IonicPage()
@Component({
	selector: 'page-events',
	templateUrl: 'events.html',
})
export class EventsPage {

	profileRef$: AngularFireObject<Profile>;
	profileData: any;
	isDonor: Boolean = true;
	isBBR: Boolean = false;
	isAdmin: Boolean = false;
	eventsRef$: AngularFireList<Events[]>;
	eventsData: any;

	notificationsCount: number;

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

			// try to get nearby needs list from firebase database
			var userId = this.afAuth.auth.currentUser.uid;

			await this.afDatabase.list<Notifications[]>(`Notifications/${userId}`, ref => ref.orderByChild('isRead').equalTo(false)).valueChanges().subscribe(data => this.notificationsCount = data.length);

			this.profileRef$ = this.afDatabase.object<Profile>(`Profile/${userId}`);
			this.profileData = this.profileRef$.valueChanges().subscribe(data => {
			  if (data.userrole == "admin") {
				this.isAdmin = true;
				this.isBBR = true;
				this.isDonor = true;
			  } else if (data.userrole == "bbr") {
				this.isAdmin = false;
				this.isBBR = true;
				this.isDonor = true;
			  } else if (data.userrole == "donor") {
				this.isAdmin = false;
				this.isBBR = false;
				this.isDonor = true;
			  }
			});
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

	// push notifications page on the top of this page
	push__notifications_page() {
		this.navCtrl.push(NotificationsPage);
	}
}