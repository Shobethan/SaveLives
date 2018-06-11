import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileFirstPage } from './profile-first';

@NgModule({
  declarations: [
    ProfileFirstPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileFirstPage),
  ],
})

export class ProfileFirstPageModule {}
