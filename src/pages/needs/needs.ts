// imports necessary packages for the needs page
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Needs } from '../../models/needs';

import { NeedsCreatePage } from "../needs-create/needs-create";

@IonicPage()
@Component({
  selector: 'page-needs',
  templateUrl: 'needs.html',
})

export class NeedsPage {

  need = {} as Needs;
  needRef$: AngularFireList<Needs>;

  createdby: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase) {
  }

  // push needs create page on the top of this page
  push__needs_create_page() {
    this.navCtrl.push(NeedsCreatePage);
  }
}
