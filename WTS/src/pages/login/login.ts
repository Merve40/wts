import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { ProfilePage } from '../profile/profile';
import { AccountTable } from '../../providers/api/account';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  database: any = firebase.database();
  storage: any = firebase.storage(); //file system (Dateien)
  require:any;

  email: any;
  password: any;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, @Inject(AccountTable) public accountTable: AccountTable) {
  }


  login() {
    if (this.email || this.password) {
      this.database.ref('/Account/')
        .orderByChild('Email').equalTo(this.email)
        .on('value', function (snapshot) {
          snapshot.forEach(element => {
            console.log(element.val());
            this.navCtrl.push(ProfilePage);
          });
        });
    } else {
      this.showLoginError("fill in username and password");
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

  t(){
    this.accountTable.getByValue("Email", "test22@mail.com" , this.onResult);
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
    var CryptoJS = this.require("crypto-js");
    // Encrypt
    var hash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    console.log(hash);
  }

}
