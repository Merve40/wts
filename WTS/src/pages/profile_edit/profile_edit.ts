import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StudentTable } from '../../providers/api/student';
import { AccountTable } from '../../providers/api/account';
import { AdressTable } from '../../providers/api/adress';
import { Student_SkillTable } from '../../providers/api/student_skill';
import { SkillTable } from '../../providers/api/skill';
import { Student_PassionTable } from '../../providers/api/student_passion';
import { PassionTable } from '../../providers/api/passion';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { ProfilePage } from '../profile/profile'



@Component({
  selector: 'page-profile_edit',
  templateUrl: 'profile_edit.html'
})
export class Profile_EditPage {

  accID: string; // AccountID die wir aus dem Login entnehmen

  // Elemente, die aus der Profile-Klasse übergeben werden sollen
  studentjson: any;
  Uni: any;
  Abschluss: any;
  Abschluss_Datum: any;
  Beschreibung: any;
  Beschaftigung: any;
  Geb_Datum: any;
  Nachname: any;
  Name: any;
  Semester: any;
  Studiengang: any;
  Vertiefung: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public AdressTable: AdressTable,
    public StudentTable: StudentTable, public AccountTable: AccountTable,
    public StudentSkillTable: Student_SkillTable, public SkillTable: SkillTable,
    public PassionTable: PassionTable, public StudentPassionTable: Student_PassionTable) {
    StudentTable.setSrcClass(this);
    AccountTable.setSrcClass(this);
    AdressTable.setSrcClass(this);
    StudentSkillTable.setSrcClass(this);
    SkillTable.setSrcClass(this);
    PassionTable.setSrcClass(this);
    StudentPassionTable.setSrcClass(this);
    this.accID = navParams.get("userId");
    this.loadData();
  }

  /**
   * Saves the changes made in profile to database
   */
  save() {
    if (this.studentjson.body.Uni != this.Uni)
      this.studentjson.body.Uni = this.Uni;
    if (this.studentjson.body.Abschluss != this.Abschluss)
      this.studentjson.body.Abschluss = this.Abschluss;
    if (this.studentjson.body.Abschluss_Datum != this.Abschluss_Datum)
      this.studentjson.body.Abschluss_Datum = this.Abschluss_Datum;
    if (this.studentjson.body.Geb_Datum != this.Geb_Datum)
      this.studentjson.body.Geb_Datum = this.Geb_Datum;
    if (this.studentjson.body.Studiengang != this.Studiengang)
      this.studentjson.body.Studiengang = this.Studiengang;
    if (this.studentjson.body.Semester != this.Semester)
      this.studentjson.body.Semester = this.Semester;
    if (this.studentjson.body.Nachname != this.Nachname)
      this.studentjson.body.Nachname = this.Nachname;
    if (this.studentjson.body.Name != this.Name)
      this.studentjson.body.Name = this.Name;
    if (this.studentjson.body.Beschaftigung != this.Beschaftigung)
      this.studentjson.body.Beschaftigung = this.Beschaftigung;
    if (this.studentjson.body.Beschreibung != this.Beschreibung)
      this.studentjson.body.Beschreibung = this.Beschreibung;
    //Date-Korrektheit hier überprüfen

    this.StudentTable.update(this.studentjson.id, this.studentjson.body, "", function (flag, json) { })
  }

  discardChanges() {
    this.StudentTable.getByValue("Account_Id", this.accID, "student-abfrage", this.onComplete);
    this.navCtrl.push(ProfilePage);
  }

  onComplete(src, json) {
    //Auslesen der Daten aus Tabelle Student where AccID = AccID
    if (src == "student-abfrage") {
      this.studentjson = json;

      this.Uni = this.studentjson.body.Uni;
      this.Abschluss = this.studentjson.body.Abschluss;
      this.Abschluss_Datum = this.studentjson.body.Abschluss_Datum;
      this.Geb_Datum = this.studentjson.body.Geb_Datum;
      this.Studiengang = this.studentjson.body.Studiengang;
      this.Semester = this.studentjson.body.Semester;
      this.Nachname = this.studentjson.body.Nachname;
      this.Name = this.studentjson.body.Name;
      this.Beschaftigung = this.studentjson.body.Beschaftigung;
      this.Beschreibung = this.studentjson.body.Beschreibung;
      console.log("Studentabfrage geladen")
    }

  }

  loadData() {
    console.log("Beginn LoadData")
    this.StudentTable.getByValue("Account_Id", this.accID, "student-abfrage", this.onComplete);
    //this.AccountTable.getById(this.AccID, "account-abfrage", this.onComplete);
    // this.StudentPassionTable.filterByValue("Account_Id", this.AccID, "passionStudent-abfrage", this.onComplete);
    //this.StudentSkillTable.filterByValue("Account_Id", this.AccID, "skill-abfrage", this.onComplete);
  }

  ngAfterViewInit() {
  }
}