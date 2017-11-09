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

//Testdaten



@Component({
  selector: 'page-list_search',
  templateUrl: 'list_search.html'
})
export class ListSearchPage implements OnResultComplete {

  result = [];
  filter = "";
  pagesize = 10;
  searchparameter = "";

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
            var accountId = element.body.Account_Id;
            if (this.result.indexOf(accountId) < 0 && this.result.length < this.pagesize) {
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
    var searchArray = this.filter.split(" ");
    searchArray.forEach(element => {
      
      if(element == "" || element == " "){
      }
      else{
      this.StudentTable.getAllContaining(this.searchparameter, element, "search-query", this.onComplete);
      }
    });
  }

  navigateToUserProfile(json) {
    console.log(json);
    this.navCtrl.setRoot(Profile_externPage, { userId: json});
  }

  ngAfterViewInit() {
    this.searchForStudents();
  }
}

