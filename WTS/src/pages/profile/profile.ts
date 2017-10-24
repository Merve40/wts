import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import firebase from 'firebase';

var AccID = 'acc_10'; // AccountID die wir aus dem Login entnehmen

// Variablen aus Tabelle Student
var abschluss;
var abschluss_datum;
var beschreibung;
var beschaeftigung;
var geb_datum;
var nachname;
var vorname;
var semester;
var studiengang;
var uni;
var vertiefung;

// Variablen aus Account
var addrID;
var email;

// Variablen der Adressdaten
var adresse;
var strasse;

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
    //Auslesen der Daten aus Tabelle Student where AccID = AccID
  this.database.ref('/Student/')
  .orderByChild('Account_Id').equalTo(AccID)
  .on('value', function (snapshot) {
    snapshot.forEach(element => {
      abschluss = (element.val().Abschluss);
      abschluss_datum = (element.val().Abschluss_Datum);
      beschreibung = (element.val().Beschreibung);
      beschaeftigung = (element.val().Beschäftigung);
      geb_datum = (element.val().Geb_Datum);
      nachname = (element.val().Nachname);
      vorname = (element.val().Name);
      semester = (element.val().Semester);
      studiengang = (element.val().Studiengang);
      uni = (element.val().Uni);
      vertiefung = (element.val().Vertiefung);
    });
  });
    //Auslesen der Daten aus Account für die AccID
   this.database.ref('/Account/' + AccID).once('value').then(function(snapshot) {
    addrID = (snapshot.val().Adresse_id);
    email = (snapshot.val().Email);
   });
    //Auslesen der Adressdaten mithilfe der addrID aus der vorherigen Query
  this.database.ref('/Adresse/' + addrID) .once('value', function (snapshot) {
    adresse = (snapshot.val().Ort + ',' + snapshot.val().PLZ + ',' + snapshot.val().Land);
    strasse = (snapshot.val().Straße);
    console.log(adresse); 
    console.log(strasse);
  });

}
  }