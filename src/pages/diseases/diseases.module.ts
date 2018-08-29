import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiseasesPage } from './diseases';

@NgModule({
  declarations: [
    DiseasesPage,
  ],
  imports: [
    IonicPageModule.forChild(DiseasesPage),
  ],
})
export class DiseasesPageModule {}
