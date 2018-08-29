// imports necessary packages for the welcome page
import { Component } from '@angular/core';

import { NeedsPage } from '../needs/needs';
import { EventsPage } from '../events/events';
import { ProfilePage } from '../profile/profile';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  tab1Root = NeedsPage;
  tab2Root = EventsPage;
  tab3Root = ProfilePage;
  tab4Root = SettingsPage

  constructor() { }
}
