import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StudentTable } from '../../providers/api/student';
import { AccountTable } from '../../providers/api/account';
import { AdressTable } from '../../providers/api/adress';
import { Student_SkillTable } from '../../providers/api/student_skill';
import { SkillTable } from '../../providers/api/skill';
import { Student_PassionTable } from '../../providers/api/student_passion';
import { PassionTable } from '../../providers/api/passion';
import { OnResultComplete } from '../../providers/api/OnResultComplete';

//Testdaten
var abschluss = "Bachelor of Science";
var nachname = "Ritzerfeld";
var name = "Moritz";
var semester = "7";

@Component({
  selector: 'page-searchbar_test',
  templateUrl: 'searchbar_test.html'
})
export class Searchbar_TestPage implements OnResultComplete {

  constructor(public navCtrl: NavController, public AdressTable: AdressTable, public StudentTable: StudentTable, public AccountTable: AccountTable, public StudentSkillTable: Student_SkillTable, public SkillTable: SkillTable, public PassionTable: PassionTable, public StudentPassionTable: Student_PassionTable) {
    StudentTable.setSrcClass(this);
    AccountTable.setSrcClass(this);
    AdressTable.setSrcClass(this);
    StudentSkillTable.setSrcClass(this);
    SkillTable.setSrcClass(this);
    PassionTable.setSrcClass(this);
    StudentPassionTable.setSrcClass(this);
  }

  onComplete(src, json) {

    switch (src) {
      case "studenten-abfrage": {

        var body = json;
        var studenten = [];
        var filter_list = [];
  
        for(var i = 0; i < json.length; i++){
          var item = json[i];
          studenten[i] = item.body.Name + " " + item.body.Nachname;
        }
        console.log(studenten);
        for(var i = 0; i < json.length; i++){
          if(this.checkForFilter("Bachelor", studenten[i])){
           filter_list.push(studenten[i]);
          }
        }

        break;
      }
      case "": {
        //statements; 
        break;
      }
      default: {
        //statements; 
        break;
      }
    }
  }

  ngAfterViewInit() {
    this.StudentTable.filterByValue("Abschluss", abschluss, "studenten-abfrage", this.onComplete);
  }
 
  checkForFilter(filter,student)
  {
    var result =
    (student.Abschluss.contains(filter)) ||
    (student.Abschluss_Datum.contains(filter)) ||
    (student.Beschäftigung.contains(filter)) ||
    (student.Geb_Datum.contains(filter)) ||
    (student.Nachname.contains(filter)) ||
    (student.Name.contains(filter)) ||
    (student.Semester.contains(filter)) ||
    (student.Studiengang.contains(filter)) ||
    (student.Uni.contains(filter)) ||
    (student.Vertiefung.contains(filter));
     return result;
  }
}

