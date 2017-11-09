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
  searchParameter = "Abschluss";

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
        if (this.result.length < this.pagesize) {
          var found = false;
          json.forEach(element => {
            var body = element.body;
            found = false;
            for (var i = 0; i < this.result.length; i++) {
              var id = this.result[i].id
              if (id == body.id) {
                found = true;
                break;
              }
            }
            if (this.result.indexOf(body) < 0 && this.result.length < this.pagesize && !found) {
              this.result.push(new Student(body.Account_Id, body.Name + " " + body.Nachname, body.Uni));
            }
          });
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  searchForStudents() {
    this.result = [];
    if (this.searchParameter != "Name") {
      this.StudentTable.getAllContaining(this.searchParameter, this.filter, "search-query", this.onComplete);
    } else {
      console.log(this.searchParameter);
      if (this.filter.indexOf(" ") !== -1) {
        var paras = this.filter.split(" ");
        paras.forEach(element => {
          console.log(element);
          this.StudentTable.getAllContaining("Nachname", this.filter, "search-query", this.onComplete);
          this.StudentTable.getAllContaining("Name", this.filter, "search-query", this.onComplete);
        });
      } else {
        this.StudentTable.getAllContaining("Nachname", this.filter, "search-query", this.onComplete);
        this.StudentTable.getAllContaining("Name", this.filter, "search-query", this.onComplete);
      }
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