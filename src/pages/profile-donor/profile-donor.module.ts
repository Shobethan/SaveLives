import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileDonorPage } from './profile-donor';

@NgModule({
  declarations: [
    ProfileDonorPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileDonorPage),
  ],
})

export class ProfileDonorPageModule {}
