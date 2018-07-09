import { IonicPage, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Events } from '../../models/events';

//import { storage,initializeApp } from 'firebase';

@IonicPage()
@Component({
  selector: 'page-addevent',
  templateUrl: 'addevent.html',
  
  })
export class AddeventPage {
      
	event = {} as Events;
    eventRef$: AngularFireList<Events>;

	today = new Date().toISOString();
	
	name = "";
	description = "";
	contact = "";
	
	
	
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private afDatabase: AngularFireDatabase,
		private afAuth: AngularFireAuth,
		private loadCtrl: LoadingController,
		private toastCtrl: ToastController,
		//private camera : Camera,
		//private FileChooser : FileChooser,
		//private File : File
		) {
		}	
	
	// text area height auto changing
  protected adjustTextarea(event: any): void {
    let textarea: any = event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    return;
  }	
  // error toast message:empty fields
  blank_create() {
    let toast = this.toastCtrl.create({
      message: "Please fill all the necessary fields",
      duration: 3000,
      position: "top",
      cssClass: "error_toast"
    });
	toast.present();
  }
	// creating new event
  async create(event: Events) {
  
  
   // loading
    var loader = this.loadCtrl.create({
      spinner: "bubbles",
	  content: "Adding..."
    });
    loader.present();
	
	try {

      // creating new event array
      this.eventRef$ = this.afDatabase.list('Events');
      await this.eventRef$.push(this.event)
      .then(() => loader.dismiss())
      .then(() => this.navCtrl.pop());
	  
	   // toast message:successful event adding
      let toast = this.toastCtrl.create({
        message: "Your event has been created",
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
    }
  }
}