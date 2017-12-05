import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';


import * as moment from 'moment';

/**
 * Page for editing Student Profile.
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class Settings {

  accID: string; // AccountID die wir aus dem Login entnehmen


  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService,
            public toastCtrl: ToastController) {

    this.accID = navParams.get("userId");
    this.loadData();
  }

  /**
   * Saves the changes made in settings to database
   */
  save() {
    
  }

  discardChanges() {

  }

  onComplete(src, json) {
    //Auslesen der Daten aus Tabelle Student where AccID = AccID


  }

  loadData() {
    
  }
}