import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  database:any = firebase.database(); 
  storage:any= firebase.storage(); //file system (Dateien)
 
  email:any;
  password:any;

  constructor(public navCtrl: NavController) {
  }

  login(){

    this.database.ref('/Account/')
      .orderByChild('Email').equalTo(this.email)
      .on('value', function(snapshot){
        snapshot.forEach(element => {
          console.log(element.val());
          //TODO: zur nächsten Seite navigieren
        });
      });
      //TODO: Login Fehler anzeigen
  } 

  create(mail, pass, addr, gruppe ){
   // console.log("test");
    this.database.ref('/Account/').push({
        Email: mail,
        Passwort:pass,
        Adresse_id: addr,
        Usergruppe: gruppe
    });
  }


}
