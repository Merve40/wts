import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { AccountTable } from '../../providers/api/account';
import { NavController, ToastController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
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

  constructor(public storage:Storage, public navCtrl: NavController, public toastCtrl: ToastController, @Inject(AccountTable) public accountTable: AccountTable, public translate: TranslateService) {
    accountTable.setSrcClass(this);
  }

  login() {
    if (this.email && this.password) {
      this.accountTable.getByValue("Email", this.email, "1", this.onComplete);
    }

  }

  onComplete(source, json) {
    if (source == "1") {
      this.validateUser(json);
    }
  }

  validateUser(json: any) {
    if (json.body.Passwort == this.password) {
      console.log("login successfull; user id: "+json.id);
      this.storage.set("user_id", json.id);
      this.navCtrl.push(ProfilePage);
    } else {
      this.translate.get('MISSINGLOGINDATAMESSAGE').subscribe(
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
