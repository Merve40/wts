import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { VisibilityTable } from '../../providers/api/visibility';

import * as moment from 'moment';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { BlockTable } from '../../providers/api/block';
import { Storage } from '@ionic/storage';
import { SettingsVisibility } from './settings_visibility/settings_visibility';


/**
 * Page for editing Student Profile.
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class Settings{

  constructor(public navCtrl: NavController, public translate: TranslateService, public storage: Storage) {
  }

  navigateToVisibility(isExtern) {
    this.storage.get("user_id").then(id=>{
      this.navCtrl.push(SettingsVisibility, { isExtern, userId:id });
    });
  }

}