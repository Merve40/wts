import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StudentTable } from '../../providers/api/student';
import { UniversityTable } from '../../providers/api/university';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { Varier } from '../../providers/varier';
import { TranslateService } from '@ngx-translate/core';
import { AccountTable } from '../../providers/api/account';


@Component({
  selector: 'page-list_search',
  templateUrl: 'list_search.html'
})
export class ListSearchPage implements OnResultComplete {

  result = [];
  filter = "";
  pagesize = 10;
  searchObject = "Student";
  searchParameterStudent = "Name";
  searchParameterUniversity = "Universität";

  constructor(public StudentTable: StudentTable, public UniversityTable: UniversityTable,public storage:Storage, 
              public translate: TranslateService, public AccountTable: AccountTable, public varier:Varier) {
      StudentTable.setSrcClass(this);
      UniversityTable.setSrcClass(this);
  }

  onComplete(src, json) {
    var found = false;
    console.log(json);
    switch (src) {
      case "student-search-query": {
        if (this.result.length < this.pagesize) {
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
              this.result.push(new User(body.Account_Id, body.Name + " " + body.Nachname, body.Uni));
            }
          });
        }
        break;
      }
      case "university-search-query": {
        if (this.result.length < this.pagesize) {
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
              this.result.push(new User(body.Account_Id, body.Universität, body.Fachrichtungen));
            }
          });
        }
      }
      default: {
        break;
      }
    }
  }

  search() {
    if (this.filter == "") {
      return;
    }
    if (this.searchObject == 'Student') {
      this.searchForStudents();
    }

    if (this.searchObject == 'University') {
      this.searchForUniversity();
    }
  }

  searchForStudents() {
    this.result = [];
    if (this.searchParameterStudent.length > 0 && this.searchParameterStudent != "Name") {
      this.StudentTable.getAllContaining(this.searchParameterStudent, this.filter, "student-search-query", this.onComplete);
    } else if (this.searchParameterStudent.length > 0) {
      if (this.filter.indexOf(" ") !== -1) {
        var paras = this.filter.split(" ");
        paras.forEach(element => {
          this.StudentTable.getAllContaining("Nachname", this.filter, "student-search-query", this.onComplete);
          this.StudentTable.getAllContaining("Name", this.filter, "student-search-query", this.onComplete);
        });
      } else {
        this.StudentTable.getAllContaining("Nachname", this.filter, "student-search-query", this.onComplete);
        this.StudentTable.getAllContaining("Name", this.filter, "student-search-query", this.onComplete);
      }
    }

  }

  searchForUniversity() {
    this.result = [];
    console.log(this.filter);
    if (this.searchParameterUniversity.length > 0) {
      this.UniversityTable.getAllContaining(this.searchParameterUniversity, this.filter, "university-search-query", this.onComplete);
    }
  }

  navigateToUserProfile(id) {
    console.log(id);
    this.varier.forward(true, id);
  }

  ngAfterViewInit() {
  }
}

class User {
  id: string;
  name: string;
  discription: string;
  constructor(id: string, name: string, discription: string) {
    this.id = id;
    this.name = name;
    this.discription = discription;
  }
}