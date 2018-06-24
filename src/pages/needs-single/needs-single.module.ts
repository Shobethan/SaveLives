import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NeedsSinglePage } from './needs-single';

@NgModule({
  declarations: [
    NeedsSinglePage,
  ],
  imports: [
    IonicPageModule.forChild(NeedsSinglePage),
  ],
})
export class NeedsSinglePageModule {}
