import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import firebase from 'firebase';

var studentID;
var AccID = 'acc_10'; // AccountID aus dem Login
var addrID;
var nachname;
var vorname;
var email;
var studiengang;
var uni;
var adresse;


@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
  })

  export class ProfilePage{

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
    /*
    this.database().ref('/Student/' + studentID).once('value').then(function(snapshot) {
      //var userObject = snapshot.val();
      nachname = (snapshot.val().Nachname);
      vorname = (snapshot.val().Name);
      console.log(nachname);
      console.log(vorname); 
  })
  */
  this.database.ref('/Account/' + AccID).once('value').then(function(snapshot) {
    //var userObject = snapshot.val();
    email = (snapshot.val().Email);
    addrID = (snapshot.val().Adresse_id);
    console.log(email);
   });
   
  this.database.ref('/Adresse/' + addrID) .once('value', function (snapshot) {
    adresse = (snapshot.val().Ort + ',' + snapshot.val().PLZ + ',' + snapshot.val().Land);
    console.log(adresse); 
  });
    
}
  }