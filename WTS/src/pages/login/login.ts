import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Inject } from '@angular/core';
import { ProfilePage } from '../profile/profile';

import { AccountTable } from '../../providers/api/account';

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

}
