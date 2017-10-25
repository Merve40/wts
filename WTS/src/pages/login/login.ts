import { Component } from '@angular/core';
<<<<<<< HEAD
import { NavController } from 'ionic-angular';
import { Inject } from '@angular/core';
import { ProfilePage } from '../profile/profile';

import { AccountTable } from '../../providers/api/account';
=======
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
>>>>>>> master

import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  database: any = firebase.database();
<<<<<<< HEAD
  storage: any = firebase.storage(); //file system (Dateien)

  email: any;
  password: any;

  constructor(public navCtrl: NavController, @Inject(AccountTable) public accountTable: AccountTable) {
  }

  login() {

    this.database.ref('/Account/')
      .orderByChild('Email').equalTo(this.email)
      .once('value').then(function (snapshot) {

        snapshot.forEach(element => {
          console.log(element.val());
          if (element.val()) {
            if (element.val().Passwort == this.password) {
              this.navCtrl.push(ProfilePage);
            } else {
              this.showError("Wrong Password");
            }
          } else {
            this.showError("Wrong Email");
          }
        });
      });
  }

  showError(message: string) {
    console.log(message);
=======
  storage: any = firebase.storage(); //file system


  email: any;
  password: any;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {

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

>>>>>>> master
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

<<<<<<< HEAD
  test() {
    var acc = { Email: this.email, Passwort: this.password, Adresse_id: "A_1", Usergruppe: "Student" };
    this.accountTable.push(acc, this.onResult);
  }

  t(){
    this.accountTable.getByValue("Email", "test22@mail.com" , this.onResult);
  }

  onResult(json) {
    console.log(json);
=======
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
>>>>>>> master
  }

}
