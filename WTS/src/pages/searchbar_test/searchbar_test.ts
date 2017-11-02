import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StudentTable } from '../../providers/api/student';
import { AccountTable } from '../../providers/api/account';
import { AdressTable } from '../../providers/api/adress';
import { Student_SkillTable } from '../../providers/api/student_skill';
import { SkillTable } from '../../providers/api/skill';
import { Student_PassionTable } from '../../providers/api/student_passion';
import { PassionTable} from '../../providers/api/passion';
import { OnResultComplete } from '../../providers/api/OnResultComplete';

//Testdaten
var abschluss = "Bachelor of Science";
var nachname = "Ritzerfeld";
var name = "Moritz";
var semester = "2";

@Component({
  selector: 'page-searchbar_test',
  templateUrl: 'searchbar_test.html'
})
export class Searchbar_TestPage implements OnResultComplete {

  constructor(public navCtrl: NavController, public AdressTable:AdressTable, public StudentTable: StudentTable, public AccountTable: AccountTable, public StudentSkillTable: Student_SkillTable, public SkillTable: SkillTable, public PassionTable: PassionTable, public StudentPassionTable: Student_PassionTable) {
    StudentTable.setSrcClass(this);
    AccountTable.setSrcClass(this);
    AdressTable.setSrcClass(this);
    StudentSkillTable.setSrcClass(this);
    SkillTable.setSrcClass(this);
    PassionTable.setSrcClass(this);
    StudentPassionTable.setSrcClass(this);
  }

  onComplete(src, json) {
    if(src == "abschluss-abfrage"){
      body = json.body;
      console.log(body);
      /*
      var result = [];

        var result = [];
        var keys = Object.keys(body);
        keys.forEach(function(key){
            result.push(body[key]);
        });
        console.log(result);
        */
    }
    
    
    if(src == "nachname-abfrage"){
      var body = json.body;
      console.log(body);
    }
    if(src == "name-abfrage"){
      var body = json.body;
      console.log(body);
    }
    if(src == "semester-abfrage"){
      var body = json.body;
      console.log(body);
    }
    
  }

  ngAfterViewInit() {
    this.StudentTable.filterByValue("Abschluss", abschluss, "abschluss-abfrage", this.onComplete);
    /*
    this.StudentTable.filterByValue("Nachname", nachname, "nachname-abfrage", this.onComplete);
    this.StudentTable.filterByValue("Name", name, "name-abfrage", this.onComplete);
    this.StudentTable.filterByValue("Semester", semester, "semester-abfrage", this.onComplete);
    */
  }
}