import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Profile_EditPage } from '../profile_edit/profile_edit'
import { StudentTable } from '../../providers/api/student';
import { AccountTable } from '../../providers/api/account';
import { AdressTable } from '../../providers/api/adress';
import { Student_SkillTable } from '../../providers/api/student_skill';
import { SkillTable } from '../../providers/api/skill';
import { Student_PassionTable } from '../../providers/api/student_passion';
import { PassionTable} from '../../providers/api/passion';
import { OnResultComplete } from '../../providers/api/OnResultComplete';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnResultComplete {

  accID:string;

  constructor(public storage:Storage, public navCtrl: NavController, public AdressTable:AdressTable, public StudentTable: StudentTable, public AccountTable: AccountTable, public StudentSkillTable: Student_SkillTable, public SkillTable: SkillTable, public PassionTable: PassionTable, public StudentPassionTable: Student_PassionTable) {
    StudentTable.setSrcClass(this);
    AccountTable.setSrcClass(this);
    AdressTable.setSrcClass(this);
    StudentSkillTable.setSrcClass(this);
    SkillTable.setSrcClass(this);
    PassionTable.setSrcClass(this);
    StudentPassionTable.setSrcClass(this);
    this.storage.get("user_id").then( (val)=> this.accID = val );
  }
  edit() {
    this.navCtrl.push(Profile_EditPage);
  }

  onComplete(src, json) {

    //Auslesen der Daten aus Tabelle Student where AccID = AccID
    if (src == "student-abfrage") {
      // console.log(json);
      var id = json.id;
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
      console.log(vorname);
    }
    //Auslesen der Daten aus Tabelle Account
    if(src == "account-abfrage") {
      var id = json.id;
      var body = json.body;
      var adresse_id = body.Adresse_id;
      
      console.log("test");
      console.log(json);
      var adresse_id = json.body.Adresse_id;

      console.log(adresse_id);
      //Verschachtelte Abfrage Account mit Adresse
      this.AdressTable.getById(adresse_id, "adresse-abfrage", this.onComplete);
    }

    //Auslesen der Daten aus Tabelle Adresse
    if(src == "adresse-abfrage"){
      var body = json.body;
      var adresse = body.Straße + ',' + body.PLZ + ',' + body.Land;
      var strasse = body.Straße;
    }
    //Auslesen der Daten aus Tabelle Leidenschaft
    if(src == "passionStudent-abfrage"){
      var body = json;
      var passion_id = body.Fähigkeit_Id;

     this.PassionTable.getById(passion_id, "passion-abfrage", this.onComplete)
    }

    if(src == "passion_abfrage"){
      var body = json;
      var passion = body.Leidenschaft;
    }
  }

  loadData(){
    this.StudentTable.getByValue("Account_Id", this.accID, "student-abfrage", this.onComplete);
    this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
    this.StudentPassionTable.getByValue("Account_Id", this.accID, "passionStudent-abfrage", this.onComplete);
  
  }

  ngAfterViewInit() {
 
  }
}