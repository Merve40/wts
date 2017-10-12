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
    console.log(this.email);

    this.database.ref('/Account/')
      .orderByChild('Email').equalTo(this.email)
      .on('value', function(snapshot){
        snapshot.forEach(element => {
          console.log(element.val());
        });
      });
  } 

  create(mail, pass, addr, gruppe ){
   // console.log("test");
    this.database.ref('/Account/').push({
        Mail: mail,
        Passwort:pass,
        Adresse_id: addr,
        Usergruppe: gruppe
    });
  }


}
