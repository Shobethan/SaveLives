import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NeedsEmergencyPage } from './needs-emergency';

@NgModule({
  declarations: [
    NeedsEmergencyPage,
  ],
  imports: [
    IonicPageModule.forChild(NeedsEmergencyPage),
  ],
})
export class NeedsEmergencyPageModule {}
