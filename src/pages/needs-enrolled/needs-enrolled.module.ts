import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NeedsEnrolledPage } from './needs-enrolled';

@NgModule({
  declarations: [
    NeedsEnrolledPage,
  ],
  imports: [
    IonicPageModule.forChild(NeedsEnrolledPage),
  ],
})
export class NeedsEnrolledPageModule {}
