import { Component } from '@angular/core';
import { AccountTable } from '../../providers/api/account';
import { ToastController } from 'ionic-angular';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';

import { Varier } from '../../providers/varier';
import * as CryptoJS from 'crypto-js';
import { Events, Platform } from 'ionic-angular';

/**
 * Page for Log-In
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnResultComplete {
  email: string;
  password: string;

  constructor(public storage: Storage, public toastCtrl: ToastController, public accountTable: AccountTable,
    public translate: TranslateService, public fcm: FCM, public varier: Varier, public events: Events,
    public platform: Platform) {
    accountTable.setSrcClass(this);
  }

  login() {
    if (this.email && this.password) {
      this.accountTable.getByValue("Email", this.email.toLowerCase(), "1", this.onComplete);
    }
    else {
      this.translate.get('MISSINGLOGINDATAMESSAGE').subscribe(
        value => {
          this.showLoginError(value);
        });
    }
  }

  onComplete(source, json) {
    
    if(!json){
      return;
    }
    
    if (source == "1") {
      if (json.body == null) {
        this.translate.get('INCORRECTLOGIN').subscribe(
          value => {
            this.showLoginError(value);
          });
      }
      else {
        this.validateUser(json);
        
      }
    }
  }

  validateUser(json: any) {

    //registers the device token for Push Notifications
    if (this.platform.is('cordova')) {
      if (json.body.Token.length == 0) {
        this.fcm.getToken().then(token => {
          json.body.Token = token;
          this.accountTable.update(json.id, json.body, "", this.onComplete);
        });
      } else {
        this.fcm.getToken().then(token => {
          if (json.body.Token != token) {
            json.body.Token = token;
            this.accountTable.update(json.id, json.body, "", this.onComplete);
          }
        });
      }
    }

    var encrypted = this.encrypt(this.password);

    if (json.body.Passwort == encrypted) {

      if (json.body.Usergruppe == "gruppe_3") {
        this.translate.get('UNILOGIN').subscribe(
          value => {
            this.showLoginError(value);
          });
      }
      else {
        this.navigateToUserProfile(json)
      }

    } else {
      this.translate.get('INCORRECTLOGIN').subscribe(
        value => {
          this.showLoginError(value);
        });
    }
  }

  navigateToUserProfile(json: any) {
    this.events.publish("login", json.id, json.body.Usergruppe);

    this.storage.set("user_id", json.id).then(val => {
      this.varier.forward(false, json.id);
    });
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
    return hash;
  }

}
