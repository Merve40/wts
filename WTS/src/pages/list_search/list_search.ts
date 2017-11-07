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
var result = [];

@Component({
  selector: 'page-list_search',
  templateUrl: 'list_search.html'
})
export class ListSearchPage implements OnResultComplete {

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
      case "search-query": {
        console.log(json.body);
        var accountId = json.body.Account_Id;
        if (result.indexOf(accountId < 0)) {
          result.push(accountId);
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

  searchForStudents(searchString) {
    result = [];
    var searchArray = searchString.split(" ");
    searchArray.forEach(element => {
      this.StudentTable.getAllContaining("Abschluss", element, "search-query", this.onComplete);
      this.StudentTable.getAllContaining("Beschäftigung", element, "search-query", this.onComplete);
      this.StudentTable.getAllContaining("Beschreibung", element, "search-query", this.onComplete);
      this.StudentTable.getAllContaining("Nachname", element, "search-query", this.onComplete);
      this.StudentTable.getAllContaining("Name", element, "search-query", this.onComplete);
      this.StudentTable.getAllContaining("Semester", element, "search-query", this.onComplete);
      this.StudentTable.getAllContaining("Studiengang", element, "search-query", this.onComplete);
      this.StudentTable.getAllContaining("Uni", element, "search-query", this.onComplete);
      this.StudentTable.getAllContaining("Vertiefung", element, "search-query", this.onComplete);
    });
  }

  ngAfterViewInit() {
    var test = "Bachelor of Science";
    this.searchForStudents(test);
  }
}

