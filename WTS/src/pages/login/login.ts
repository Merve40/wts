import { Component } from '@angular/core';
import { AccountTable } from '../../providers/api/account';
import { ToastController } from 'ionic-angular';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';

import { Varier } from '../../providers/varier';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnResultComplete {
  email: any;
  password: any;

  constructor(public storage: Storage, public toastCtrl: ToastController, public accountTable: AccountTable, 
              public translate: TranslateService,public fcm:FCM, public varier:Varier) {
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
      // if(json.body.Usergruppe = "gruppe_3"){        
      //   this.translate.get('UNILOGIN').subscribe(
      //      value => {
      //        this.showLoginError(value);
      //      });
      //  }
    else{
      this.validateUser(json);
      }
    }
  }

  validateUser(json: any) {
    
    //registers the device token for Push Notifications
    /*
    if(json.body.Token.length == 0){
      this.fcm.getToken().then(token=>{
        json.body.Token = token;
        this.accountTable.update(json.id, json.body, "", this.onComplete);
      });
    }
    */
    var encrypted = this.encrypt(this.password);

    if (json.body.Passwort == encrypted ) {
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
    this.varier.forward(false, json.id);
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
    return hash;
  }

}
