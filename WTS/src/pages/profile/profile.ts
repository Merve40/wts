import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Profile_EditPage } from '../profile_edit/profile_edit'
import { StudentTable } from '../../providers/api/student';
import { AccountTable } from '../../providers/api/account';
import { AdressTable } from '../../providers/api/adress';
import { OnResultComplete } from '../../providers/api/OnResultComplete';

var AccID = 'acc_10'; // AccountID die wir aus dem Login entnehmen

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnResultComplete {

  constructor(public navCtrl: NavController, public StudentTable: StudentTable, public AccountTable: AccountTable) {
    StudentTable.setSrcClass(this);
    AccountTable.setSrcClass(this);
  }
  edit() {
    this.navCtrl.push(Profile_EditPage);
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

  ngAfterViewInit() {

    this.StudentTable.getByValue("Account_Id", AccID, "student-abfrage", this.onComplete);
    this.AccountTable.getById(AccID, "account-abfrage", this.onComplete);
   
    // this.AccountTable.getById(AccID, function(json){
    //   var addrID = json.Adresse_id;
    //   var email = json.Email;
    //   //console.log(addrID);
    //   this.AdressTable.getById(addrID, function(json){
    //     var adresse = json.City + ',' + json.Postcode + ',' + json.Country;
    //     var strasse = json.Street;
    //     console.log(adresse); 
    //     console.log(strasse);
    //   });
    // });



  }




  //Auslesen der Daten aus Account für die AccID
  /*this.database.ref('/Account/' + AccID).once('value').then(function (snapshot) {
    addrID = (snapshot.val().Adresse_id);
    email = (snapshot.val().Email);
  });
  */
  //Auslesen der Adressdaten mithilfe der addrID aus der vorherigen Query
  /*
  this.database.ref('/Adresse/' + addrID) .once('value', function (snapshot) {
    adresse = (snapshot.val().Ort + ',' + snapshot.val().PLZ + ',' + snapshot.val().Land);
    strasse = (snapshot.val().Straße);
    console.log(adresse); 
    console.log(strasse);
  });
  */
}