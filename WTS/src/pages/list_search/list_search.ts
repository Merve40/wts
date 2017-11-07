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
var pagesize = 10;


@Component({
  selector: 'page-list_search',
  templateUrl: 'list_search.html'
})
export class ListSearchPage implements OnResultComplete {

  result = [];
  filter = "";

  constructor(public navCtrl: NavController, public AdressTable: AdressTable, public StudentTable: StudentTable, public AccountTable: AccountTable, public StudentSkillTable: Student_SkillTable, public SkillTable: SkillTable, public PassionTable: PassionTable, public StudentPassionTable: Student_PassionTable) {
    StudentTable.setSrcClass(this);
    AccountTable.setSrcClass(this);
    AdressTable.setSrcClass(this);
    StudentSkillTable.setSrcClass(this);
    SkillTable.setSrcClass(this);
    PassionTable.setSrcClass(this);
    StudentPassionTable.setSrcClass(this);

    this.result = [
      "1",
      "2",
      "3"
    ];
  }

  onComplete(src, json) {
    console.log(json);
    switch (src) {
      case "search-query": {
        if (this.result.length < pagesize) {
          json.forEach(element => {
            var accountId = element.body.Account_Id;
            if (this.result.indexOf(accountId) < 0 && this.result.length < pagesize) {
              this.result.push(accountId);
            }
          });
        }
        break;
      }
      default: {
        //statements; 
        break;
      }
    }
    console.log(this.result);
  }

  searchForStudents() {
    this.result = [];
    console.log(this.filter);
    var searchArray = this.filter.split(" ");
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
    this.searchForStudents();
  }
}

