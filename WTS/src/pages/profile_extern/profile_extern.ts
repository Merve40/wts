import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import firebase from 'firebase';

var studentID;
var AccID = 'acc_10'; // AccountID die wir aus der Suche entnehmen
var nachname; 
var vorname;
var studiengang;
var uni;
var adresse;


@Component({
    selector: 'page-profile_extern',
    templateUrl: 'profile_extern.html'
  })

  export class Profile_externPage{

    database:any = firebase.database(); 
    storage:any = firebase.storage(); //file system (Dateien)
    
    constructor(public navCtrl: NavController) {
    }

  ngAfterViewInit(){
    this.database.ref('/Student/')
    .orderByChild('Account_Id').equalTo(AccID)
    .on('value', function (snapshot) {
      snapshot.forEach(element => {
        nachname = (element.val().Nachname);
        vorname = (element.val().Name);
        studiengang = (element.val().Studiengang);
        uni = (element.val().Uni);
        console.log(nachname);
        console.log(vorname); 
      });
    });
    
}
  }