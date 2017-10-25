import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { AccountTable } from '../../providers/api/account';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnResultComplete {

  database: any = firebase.database();
  storage: any = firebase.storage(); //file system (Dateien)
  require:any;

  email: any;
  password: any;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, @Inject(AccountTable) public accountTable: AccountTable) {
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
    this.accountTable.getByValue("Email","test33@mail.com" , "1", this.onComplete);
    this.accountTable.filterByValue("Adresse_id", "A_1", "2", this.onComplete);
  }

  onComplete(source, json) {
    if(source == "1"){
      console.log(json);
    }else if(source == "2"){
      console.log(json);
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
