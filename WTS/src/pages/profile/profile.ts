import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Profile_EditPage } from '../profile_edit/profile_edit'
import { StudentTable } from '../../providers/api/student';
import { AccountTable } from '../../providers/api/account';
import { AdressTable } from '../../providers/api/adress';
import { Student_SkillTable } from '../../providers/api/student_skill';
import { SkillTable } from '../../providers/api/skill';
import { Student_PassionTable } from '../../providers/api/student_passion';
import { PassionTable} from '../../providers/api/passion';
import { OnResultComplete } from '../../providers/api/OnResultComplete';

var AccID = 'acc_10'; // AccountID die wir aus dem Login entnehmen

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnResultComplete {

  constructor(public navCtrl: NavController, public AdressTable:AdressTable, public StudentTable: StudentTable, public AccountTable: AccountTable, public StudentSkillTable: Student_SkillTable, public SkillTable: SkillTable, public PassionTable: PassionTable, public StudentPassionTable: Student_PassionTable) {
    StudentTable.setSrcClass(this);
    AccountTable.setSrcClass(this);
    AdressTable.setSrcClass(this);
    StudentSkillTable.setSrcClass(this);
    SkillTable.setSrcClass(this);
    PassionTable.setSrcClass(this);
    StudentPassionTable.setSrcClass(this);
  }
  edit() {
    this.navCtrl.push(Profile_EditPage);
  }

  onComplete(src, json) {

    //Auslesen der Daten aus Tabelle Student where AccID = AccID
    if (src == "student-abfrage") {
      var body = json.body;
      var abschluss = body.Abschluss;
      var abschluss_datum = body.Abschluss_Datum;
      var beschreibung = body.Beschreibung;
      var beschaeftigung = body.Beschäftigung;
      var geb_datum = body.Geb_Datum;
      var nachname = body.Nachname;
      var vorname = body.Name;
      var semester = body.Semester;
      var studiengang = body.Studiengang;
      var uni = body.Uni;
      var vertiefung = body.Vertiefung;
      console.log(uni);
    }
    //Auslesen der Daten aus Tabelle Account
    if(src == "account-abfrage") {
      var body = json.body;
      var adresse_id = body.Adresse_id;
      //Verschachtelte Abfrage Account mit Adresse
      this.AdressTable.getById(adresse_id, "adresse-abfrage", this.onComplete);
    }

    //Auslesen der Daten aus Tabelle Adresse
    if(src == "adresse-abfrage"){
      var body = json.body;
      var adresse = body.Ort + ', ' + body.PLZ + ', ' + body.Land;
      var strasse = body.Straße;
      console.log(adresse);
      console.log(strasse);
    }
    //Auslesen der Daten aus Tabelle Leidenschaft
    if(src == "passionStudent-abfrage"){
      console.log("test");
      var body = json.body;
      var passion_id = body.Leidenschaft_Id;
     this.PassionTable.getById(passion_id, "passion-abfrage", this.onComplete)
    }

    if(src == "passion-abfrage"){
      //Hier kommt er nicht mehr rein in der Abfrage
      var body = json.body;
      var passion = body.Leidenschaft;
      console.log(passion);
    }
    //Auslesen der Daten aus Tabelle Fähigkeit
    if(src == "skillStudent-abfrage"){
      var body = json.body;
      var skill_id = body.Fähigkeit_Id;
     this.SkillTable.getById(skill_id, "skill-abfrage", this.onComplete)
    }
    if(src == "skill-abfrage"){
      //Hier kommt er nicht mehr rein
      var body = json.body;
      var skill = body.Fähigkeit;
      console.log(skill);
    }
  
  }

  ngAfterViewInit() {

    this.StudentTable.getByValue("Account_Id", AccID, "student-abfrage", this.onComplete);
    this.AccountTable.getById(AccID, "account-abfrage", this.onComplete);
    this.StudentPassionTable.getByValue("Account_Id", AccID, "passionStudent-abfrage", this.onComplete);
    this.StudentSkillTable.getByValue("Account_Id", AccID, "skillStudent-abfrage", this.onComplete);
  }
}