import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Profile_EditPage } from '../profile_edit/profile_edit'
import { StudentTable } from '../../providers/api/student';
import { AccountTable } from '../../providers/api/account';
import { AdressTable } from '../../providers/api/adress';
import { Student_SkillTable } from '../../providers/api/student_skill';
import { SkillTable } from '../../providers/api/skill';
import { Student_PassionTable } from '../../providers/api/student_passion';
import { PassionTable } from '../../providers/api/passion';
import { OnResultComplete } from '../../providers/api/OnResultComplete';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnResultComplete {

  accID: string;
  isExtern: boolean;

  constructor(public storage:Storage, public navCtrl: NavController, public navParams: NavParams, public AdressTable: AdressTable, public StudentTable: StudentTable, public AccountTable: AccountTable, public StudentSkillTable: Student_SkillTable, public SkillTable: SkillTable, public PassionTable: PassionTable, public StudentPassionTable: Student_PassionTable) {
    StudentTable.setSrcClass(this);
    AccountTable.setSrcClass(this);
    AdressTable.setSrcClass(this);
    StudentSkillTable.setSrcClass(this);
    SkillTable.setSrcClass(this);
    PassionTable.setSrcClass(this);
    StudentPassionTable.setSrcClass(this);

    
    this.accID = navParams.get("userId");
    this.isExtern = navParams.get("isExtern");
    this.isExtern = false;
    console.log(this.isExtern);
    this.load();
    //this.storage.get("user_id").then( (id) => this.load(id));
 }

  load(){
    if(this.isExtern == true){
      console.log("Openend is extern");
      this.accID = this.navParams.get("userId");
      this.StudentTable.getByValue("Account_Id", this.accID, "student-abfrage", this.onComplete);
      this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
      this.StudentPassionTable.filterByValue("Account_Id", this.accID, "passionStudent-abfrage", this.onComplete);
      this.StudentSkillTable.filterByValue("Account_Id", this.accID, "skill-abfrage", this.onComplete);
    }else{
      console.log("Openend is NOT extern");
      //document.getElementById("edit").style.display = 'none';
      this.StudentTable.getByValue("Account_Id", this.accID, "student-abfrage", this.onComplete);
      this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
      this.StudentPassionTable.filterByValue("Account_Id", this.accID, "passionStudent-abfrage", this.onComplete);
      this.StudentSkillTable.filterByValue("Account_Id", this.accID, "skill-abfrage", this.onComplete);
    }
  }

  edit() {
    this.navCtrl.push(Profile_EditPage, {userId:this.accID});
  }

  onComplete(src, json) {

    //Auslesen der Daten aus Tabelle Student where AccID = AccID
    if (src == "student-abfrage") {
      console.log("student abfrage");
      console.log(json);
      var id = json.id;
      var body = json.body;
      var name = json.body.Name + " " + json.body.Nachname;

      document.getElementById("name").innerText = name;
      document.getElementById("dateOfBirth").innerText = body.Geb_Datum != "" || body.Geb_Datum != null ? body.Geb_Datum : "01.01.1970";
      document.getElementById("uni").innerText = body.Uni;
      document.getElementById("studyProgram").innerText = body.Studiengang;
      document.getElementById("degree").innerText = body.Abschluss;
      document.getElementById("studyProgress").innerText = body.Semester;
      document.getElementById("endOfStudy").innerText = body.Abschluss_Datum;
    }
    //Auslesen der Daten aus Tabelle Account
    if (src == "account-abfrage") {
      console.log("account abfrage");
      console.log(json);

      var body = json.body;
      var adresse_id = body.Adresse_id;

      document.getElementById("email").innerText = body.Email;
      //Verschachtelte Abfrage Account mit Adresse
      this.AdressTable.getById(adresse_id, "adresse-abfrage", this.onComplete);
    }

    //Auslesen der Daten aus Tabelle Adresse
    if (src == "adresse-abfrage") {
      console.log("adresse abfrage");
      console.log(json);

      var body = json.body;
      var adresse = body.Straße + ', ' + body.PLZ + ', ' + body.Land;

      document.getElementById("address").innerText = adresse;
    }
    //Auslesen der Daten aus Tabelle Leidenschaft
    if (src == "passionStudent-abfrage") {
      console.log("passion student abfrage");
      console.log(json);

      //überprüft erst ob Leidenschaft existiert
      if (json[0].body) {
        var passions = "";

        for (var i = 0; i < json.length; i++) {
          var item = json[i];

          //anonymer Aufruf
          let asyncCall: Function = (source, _json) => {

            var num = +source;
            console.log(num);
            passions += _json.body.Leidenschaft;

            if (num + 1 < json.length) {
              passions += ", ";
            } else {
              document.getElementById("interests").innerText = passions;
            }

          }

          this.PassionTable.getById(item.body.Leidenschaft_Id, "" + i, asyncCall);
        }

      } else {
        document.getElementById("interests").className = "hidden";
      }
    }

    if (src == "skill-abfrage") {
      console.log("skill abfrage");
      console.log(json);

      //überprüft erst ob Fähigkeit existiert
      if (json[0].body) {

        var body = json;
        var skills = "";

        for (var i = 0; i < json.length; i++) {
          var item = json[i];

          //anonymer Aufruf
          let asyncCall:Function = (source, _json) =>{
            var num = +source;
            skills += _json.body.Fähigkeit;

            if (num + 1 < json.length) {
              skills += ", ";
            } else {
              document.getElementById("skills").innerText = skills;
            }
          }

          this.SkillTable.getById(item.body.Fähigkeit_Id, ""+i, asyncCall);
        }

      } else { 
        document.getElementById("skills").className = "hidden"; 
      }
    }
  }


  // ngAfterViewInit() {
  //   this.StudentTable.getByValue("Account_Id", this.accID, "student-abfrage", this.onComplete);
  //   this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
  //   this.StudentPassionTable.filterByValue("Account_Id", this.accID, "passionStudent-abfrage", this.onComplete);
  //   this.StudentSkillTable.filterByValue("Account_Id", this.accID, "skill-abfrage", this.onComplete);
  // }

}