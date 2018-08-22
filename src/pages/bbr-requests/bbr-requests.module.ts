import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BbrRequestsPage } from './bbr-requests';

@NgModule({
  declarations: [
    BbrRequestsPage,
  ],
  imports: [
    IonicPageModule.forChild(BbrRequestsPage),
  ],
})
export class BbrRequestsPageModule {}
