import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { AccountTable } from '../../providers/api/account';
import { NavController, ToastController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { CompanyProfilePage } from '../company_profile/company_profile';
import { UniProfilePage } from '../uni_profile/uni_profile';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnResultComplete {

  require: any;

  email: any;
  password: any;

  constructor(public storage: Storage, public navCtrl: NavController, public toastCtrl: ToastController, @Inject(AccountTable) public accountTable: AccountTable, public translate: TranslateService) {
    accountTable.setSrcClass(this);
  }

  login() {
    console.log("logging in..");
    if (this.email && this.password) {
      this.accountTable.getByValue("Email", this.email, "1", this.onComplete);
    }
    else{
      this.translate.get('MISSINGLOGINDATAMESSAGE').subscribe(
        value => {
          this.showLoginError(value);
        });
    }
  }

  onComplete(source, json) {
    if (source == "1") {
      console.log("Entered source 1");
      if(json.body == null){     
        
        console.log("OnComplete: Email is not correct")
        this.translate.get('INCORRECTLOGIN').subscribe(
          value => {
            this.showLoginError(value);
          });

        
      }
    else{
      console.log("OnComplete:Email is correct");
      this.validateUser(json);
    }
    }
  }

  validateUser(json: any) {
    console.log("Entered validate user");

    if (json.body.Passwort == this.password ) {
      console.log("Password was correct");
      this.navigateToUserProfile(json);
    
    
    } else {
      console.log("Input was not correct");
      this.translate.get('INCORRECTLOGIN').subscribe(
        value => {
          this.showLoginError(value);
        });
    }
  }

  navigateToUserProfile(json: any) {
    this.storage.set("user_id", json.id);

    switch (json.body.Usergruppe) {
      case "gruppe_1": this.navCtrl.push(ProfilePage, { userId: json.id });
        break;
      //todo: Student Profil (ProfilePage) mit Unternehmen Profil ersetzen
      case "gruppe_2": this.navCtrl.push(CompanyProfilePage, { userId: json.id });
        break;
      //todo: Student Profil (ProfilePage) mit Uni Profil ersetzen
      case "gruppe_3": this.navCtrl.push(UniProfilePage, { userId: json.id });
        break;
      default:
      console.log("Entered navigation: DB Error");
        this.translate.get('DB-ERROR').subscribe(
          value => {
            this.showLoginError(value);
          });
    }

  }

  showLoginError(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  encrypt(password) {
    var CryptoJS = this.require("crypto-js");
    // Encrypt
    var hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    console.log(hash);
  }

}
