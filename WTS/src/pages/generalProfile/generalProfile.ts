import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccountTable } from '../../providers/api/account';
import { OnResultComplete } from '../../providers/api/OnResultComplete';

import { ProfilePage } from '../profile/profile';
import { CompanyProfilePage } from '../company_profile/company_profile';
import { UniProfilePage } from '../uni_profile/uni_profile';

@Component({
  selector: 'page-general_profile',
  templateUrl: 'general_profile.html'
})
export class GeneralProfilePage implements OnResultComplete {

  AccID = 'acc_11';
  
  constructor(public storage:Storage, public navCtrl: NavController, 
    public AccountTable: AccountTable) {
    AccountTable.setSrcClass(this);
    this.loadData();
    }

  onComplete(src, json) { 
    if (src == "account-abfrage") {
        this.navigateToUserProfile(json);
    }   
  }

  navigateToUserProfile(json: any) {
    this.storage.set("user_id", json.id);

    switch (json.body.Usergruppe) {
      case "Student": this.navCtrl.push(ProfilePage, { userId: json.id });
        break;
      //todo: Student Profil (ProfilePage) mit Unternehmen Profil ersetzen
      case "Unternehmen": this.navCtrl.push(CompanyProfilePage, { userId: json.id });
        break;
      //todo: Student Profil (ProfilePage) mit Uni Profil ersetzen
      case "Universität": this.navCtrl.push(UniProfilePage, { userId: json.id });
        break;
    }
  }

  loadData(){
    this.AccountTable.getById(this.AccID, "account-abfrage", this.onComplete);
  }

  ngAfterViewInit() {
  }
}