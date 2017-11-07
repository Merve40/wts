import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { AccountTable } from '../../providers/api/account';
import { NavController, ToastController } from 'ionic-angular';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { Profile_externPage } from '../profile_extern/profile_extern';
import * as CryptoJS from 'crypto-js';

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
      if(json.body == null){        
       this.translate.get('INCORRECTLOGIN').subscribe(
          value => {
            this.showLoginError(value);
          });
      }
    else{
      this.validateUser(json);
      }
    }
  }

  validateUser(json: any) {

    if (json.body.Passwort == this.password ) {
      this.encrypt(this.password);
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

    this.navCtrl.setRoot(Profile_externPage, { userId: json.id });
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
