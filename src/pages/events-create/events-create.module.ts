import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsCreatePage } from './events-create';

@NgModule({
  declarations: [
    EventsCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(EventsCreatePage),
  ],
})
export class EventsCreatePageModule {}
