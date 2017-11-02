import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StudentTable } from '../../providers/api/student';
import { AccountTable } from '../../providers/api/account';
import { AdressTable } from '../../providers/api/adress';
import { OnResultComplete } from '../../providers/api/OnResultComplete';

import firebase from 'firebase';

var AccID = 'acc_10'; // AccountID die wir aus dem Login entnehmen


@Component({
  selector: 'page-profile_edit',
  templateUrl: 'profile_edit.html'
})
export class Profile_EditPage implements OnResultComplete {
  database: any = firebase.database();
  storage: any = firebase.storage(); //file system (Dateien)
  studiengang: any;

  constructor(public navCtrl: NavController, public StudentTable: StudentTable, public AccountTable: AccountTable) {
    StudentTable.setSrcClass(this);
    AccountTable.setSrcClass(this);
    }
  
  /**
   * Saves the changes made in profile to database
   */
  save(){

  }

  onComplete(src, json) {
    //Auslesen der Daten aus Tabelle Student where AccID = AccID
    if (src == "account-abfrage") {

      var abschluss = json.Abschluss;
      var abschluss_datum = json.Abschluss_Datum;
      var beschreibung = json.Beschreibung;
      var beschaeftigung = json.Beschäftigung;
      var geb_datum = json.Geb_Datum;
      var nachname = json.Nachname;
      var vorname = json.Name;
      var semester = json.Semester;
      var studiengang = json.Studiengang;
      var uni = json.Uni;
      var vertiefung = json.Vertiefung;
      console.log(vorname);
    }
    if(src == "account-abfrage") {
      var adresse = json.City + ',' + json.Postcode + ',' + json.Country;
      var strasse = json.Street;
      console.log(adresse);
    }
  }

  ngAfterViewInit(){
    this.StudentTable.getByValue("Account_Id", AccID, "student-abfrage", this.onComplete);
    this.AccountTable.getById(AccID, "account-abfrage", this.onComplete);
  }
}