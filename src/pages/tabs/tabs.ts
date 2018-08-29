// imports necessary packages for the welcome page
import { Component } from '@angular/core';

import { PatientsPage } from '../patients/patients';
import { ProfilePage } from '../profile/profile';
import { SettingsPage } from '../settings/settings';
import { DiseasesPage } from '../diseases/diseases';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  tab1Root = PatientsPage;
  tab2Root = DiseasesPage;
  tab3Root = ProfilePage;
  tab4Root = SettingsPage

  constructor() { }
}
