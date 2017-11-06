import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccountTable } from '../../providers/api/account';
import { OnResultComplete } from '../../providers/api/OnResultComplete';

import { ProfilePage } from '../profile/profile';
import { CompanyProfilePage } from '../company_profile/company_profile';
import { UniProfilePage } from '../uni_profile/uni_profile';

@Component({
    selector: 'page-profile_extern',
    templateUrl: 'profile_extern.html'
  })

  export class Profile_externPage implements OnResultComplete{

    accID = 'acc_11';    
    
    constructor(public storage:Storage, public navCtrl: NavController, public navParams: NavParams,
      public AccountTable: AccountTable) {

        console.log("Started constructor");
        //this.accID = navParams.get("userId");
        this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
        }

    onComplete(src, json) {
      if (src == "account-abfrage") {
        console.log("went into onComplete");
        var body = json.body;
        var group_id = body.Usergruppe;
        console.log("group_id: " + group_id);        
        this.navigateToUserProfile(json);
        console.log("END");     
      } 
      console.log("Printed as well");   
    }

    navigateToUserProfile(json) {
      console.log("went into navigateToUserProfile");
      //this.storage.set("user_id", json.id);
       
      switch (json.body.Usergruppe) {
        case "gruppe_1": this.navCtrl.push(ProfilePage, { userId: json.id });
          break;
        //todo: Student Profil (ProfilePage) mit Unternehmen Profil ersetzen
        case "gruppe_2": this.navCtrl.push(CompanyProfilePage, { userId: json.id });
          break;
        //todo: Student Profil (ProfilePage) mit Uni Profil ersetzen
        case "gruppe_3": this.navCtrl.push(UniProfilePage, { userId: json.id });
          break;
      }
    }

  ngAfterViewInit(){   
  }
}