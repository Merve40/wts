import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StudentTable } from '../../providers/api/student';
import { AccountTable } from '../../providers/api/account';
import { AdressTable } from '../../providers/api/adress';
import { Student_SkillTable } from '../../providers/api/student_skill';
import { SkillTable } from '../../providers/api/skill';
import { Student_PassionTable } from '../../providers/api/student_passion';
import { PassionTable } from '../../providers/api/passion';
import { Profile_externPage } from '../profile_extern/profile_extern';
import { OnResultComplete } from '../../providers/api/OnResultComplete';


@Component({
  selector: 'page-list_search',
  templateUrl: 'list_search.html'
})
export class ListSearchPage implements OnResultComplete {

  result = [];
  filter = "";
  pagesize = 10;
  searchParameter = "";

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
    console.log(json);
    switch (src) {
      case "search-query": {
        if (this.result.length < this.pagesize) {
          json.forEach(element => {
            var body = element.body;
            if (this.result.indexOf(body.account) < 0 && this.result.length < this.pagesize) {
              this.result.push(new Student(body.AccountId, body.Name + " " + body.Nachname, body.Uni));
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
    console.log(this.searchParameter);
    this.result = [];
    if (this.searchParameter.length > 1 && this.searchParameter != "Name") {
      this.StudentTable.getAllContaining(this.searchParameter, this.filter, "search-query", this.onComplete);
    } else if (this.searchParameter.length > 0) {
      var paras = this.searchParameter.split(" ");
      paras.forEach(element => {
        this.StudentTable.getAllContaining(this.searchParameter, "Name", "search-query", this.onComplete);
        this.StudentTable.getAllContaining(this.searchParameter, "Nachname", "search-query", this.onComplete);
      });
    }

  }

  navigateToUserProfile(id) {
    console.log(id);
    this.navCtrl.setRoot(Profile_externPage, { userId: id });
  }

  ngAfterViewInit() {
    this.searchForStudents();
  }
}

class Student {
  id: string;
  name: string;
  university: string;
  constructor(id: string, name: string, university: string) {
    this.id = id;
    this.name = name;
    this.university = university;
  }
}