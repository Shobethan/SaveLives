import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NeedsCreatePage } from './needs-create';

@NgModule({
  declarations: [
    NeedsCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(NeedsCreatePage),
  ],
})

export class NeedsCreatePageModule {}
