import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { AccountTable } from '../../providers/api/account';
import { NavController, ToastController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  database: any = firebase.database();
  storage: any = firebase.storage(); //file system (Dateien)

  email: any;
  password: any;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, @Inject(AccountTable) public accountTable: AccountTable, public translate: TranslateService) {
  }

  login() {
    var t = this;

    if (this.email || this.password) {
      this.database.ref('/Account/')
        .orderByChild('Email').equalTo(this.email)
        .on('value', function (snapshot) {
          snapshot.forEach(element => {
            console.log(element.val());
            t.navCtrl.push(ProfilePage);
          });
        });
    } else {
      this.translate.get('MISSINGLOGINDATAMESSAGE').subscribe(
        value => {
          this.showLoginError(value);
        }
      )
    }
  }

  create(mail, pass, addr, gruppe) {
    // console.log("test");
    this.database.ref('/Account/').push({
      Email: mail,
      Passwort: pass,
      Adresse_id: addr,
      Usergruppe: gruppe
    });
  }

  test() {
    var acc = { Email: this.email, Passwort: this.password, Adresse_id: "A_1", Usergruppe: "Student" };
    this.accountTable.push(acc, this.onResult);
  }

  t() {
    this.accountTable.getByValue("Email", "test22@mail.com", this.onResult);
  }

  onResult(json) {
    console.log(json);
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
    var CryptoJS = require("crypto-js");
    // Encrypt
    var hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    console.log(hash);
  }

}
