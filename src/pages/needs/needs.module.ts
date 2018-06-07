import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NeedsPage } from './needs';

@NgModule({
  declarations: [
    NeedsPage,
  ],
  imports: [
    IonicPageModule.forChild(NeedsPage),
  ],
})
export class NeedsPageModule {}
