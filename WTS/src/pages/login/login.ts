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

const  CryptoJS = require("crypto-js");

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnResultComplete {
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
    //contains example (Student)
    this.accountTable.getAllContaining("Usergruppe", "tuden", "contains-test", this.onComplete);
  }

  onComplete(source, json) {
    if (source == "1") {
      this.validateUser(json);
    }else if(source == "contains-test"){
      console.log(json);
    }
  }

  validateUser(json: any) {
    if (json.body.Passwort == this.password) {
      this.encrypt(this.password);
      this.navigateToUserProfile(json);

    } else {
      this.translate.get('MISSINGLOGINDATAMESSAGE').subscribe(
        value => {
          this.showLoginError(value);
        });
    }
  }

  navigateToUserProfile(json: any) {
    this.storage.set("user_id", json.id);



    switch (json.body.Usergruppe) {
      case "gruppe_1": this.navCtrl.setRoot(ProfilePage, { userId: json.id });
        break;
      //todo: Student Profil (ProfilePage) mit Unternehmen Profil ersetzen
      case "gruppe_2": this.navCtrl.setRoot(CompanyProfilePage, { userId: json.id });
        break;
      //todo: Student Profil (ProfilePage) mit Uni Profil ersetzen
      case "gruppe_3": this.navCtrl.setRoot(UniProfilePage, { userId: json.id });
        break;
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
    var hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    console.log(hash);
  }

}
