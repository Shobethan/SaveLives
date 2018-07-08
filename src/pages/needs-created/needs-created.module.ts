import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NeedsCreatedPage } from './needs-created';

@NgModule({
  declarations: [
    NeedsCreatedPage,
  ],
  imports: [
    IonicPageModule.forChild(NeedsCreatedPage),
  ],
})
export class NeedsCreatedPageModule {}
