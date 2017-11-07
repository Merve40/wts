import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccountTable } from '../../providers/api/account';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { TranslateService } from '@ngx-translate/core';

import { ProfilePage } from '../profile/profile';
import { CompanyProfilePage } from '../company_profile/company_profile';
import { UniProfilePage } from '../uni_profile/uni_profile';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-profile_extern',
    templateUrl: 'profile_extern.html'
  })

  export class Profile_externPage implements OnResultComplete{

    accID:string;   
    isExtern: boolean; 
    
    constructor(public storage:Storage, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,
      public translate: TranslateService, public AccountTable: AccountTable) {
        AccountTable.setSrcClass(this);
        this.storage.get("user_id").then( (id) => this.load(id));
    }

    load(id){
      //Checks if navigation was made from side menu.
      //in this case navParams.get will be null because no id was transferred
      if(this.navParams.get("userId") == null){
        this.isExtern = false;
        console.log("Wichtig: " + id);
        this.accID = id;
        console.log("accID ist jetzt: " + this.accID);
        this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
      
      // Navigates to own profile 
      }else if(id == this.navParams.get("user_id")){
        this.isExtern = false;
        this.accID = id;
        this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
      //Navigates to foreign profile
      }else{
        this.isExtern = true;
        this.accID = this.navParams.get("userId");
        console.log("accID ist jetzt: " + this.accID);
        this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
      } 
    }

    onComplete(src, json) {
      if (src == "account-abfrage") {
        console.log("Account abfrage in Profile_Extern");
        var body = json.body;
        var group_id = body.Usergruppe;  
        console.log("json.id = " + json.id);  
        console.log("json.id = " + json.body.Email);  
        this.navigateToUserProfile(json);   
      }   
    }

    navigateToUserProfile(json) {
      console.log("opened navigate to profile in profile_extern");
      switch (json.body.Usergruppe) {
        case "gruppe_1": this.navCtrl.setRoot(ProfilePage, { userId: json.id, isExtern: this.isExtern });
          break;
        case "gruppe_2": this.navCtrl.setRoot(CompanyProfilePage, { userId: json.id });
          break;
        case "gruppe_3": this.navCtrl.setRoot(UniProfilePage, { userId: json.id });
          break;
        default:
        console.log("Entered navigation: DB Error");
        this.navCtrl.setRoot(LoginPage, { userId: json.id });
          this.translate.get('DB-ERROR').subscribe(
            value => {
              this.showError(value);
            });
      }
    }

    showError(message) {
      const toast = this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }

  ngAfterViewInit(){   
  }
}