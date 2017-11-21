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
  pagesize = 4;
  searchObject = "Student";
  searchParameterStudent = "Name";
  searchParameterUniversity = "Universität";
  infinityScroll;

  constructor(public StudentTable: StudentTable, public UniversityTable: UniversityTable,public storage:Storage, 
              public translate: TranslateService, public AccountTable: AccountTable, public varier:Varier) {
      StudentTable.setSrcClass(this);
      UniversityTable.setSrcClass(this);
  }

  onComplete(src, json) {
    switch (src) {
      case "first-name-search-query": {
        if (this.result.length < this.pagesize) {
          json.forEach(element => {
            var found = false;
            var body = element.body;
            for (var i = 0; i < this.result.length; i++) {
              var id = this.result[i].id;
              if (id == body.Account_Id) {
                found = true;
                break;
              }
            }
            if (this.result.indexOf(body) < 0 && this.result.length < this.pagesize && !found) {
              var user = new User(body.Account_Id, body.Name + " " + body.Nachname, body.Uni);
              this.result.push(user);
            }
          });
        }
        this.StudentTable.getAllContaining("Nachname", this.filter, "student-search-query", this.onComplete);
        return;
      }
      case "student-search-query": {
        if (this.result.length < this.pagesize) {
          json.forEach(element => {
            var found = false;
            var body = element.body;
            for (var i = 0; i < this.result.length; i++) {
              var id = this.result[i].id;
              if (id == body.Account_Id) {
                found = true;
                break;
              }
            }
            if (this.result.indexOf(body) < 0 && this.result.length < this.pagesize && !found) {
              var user = new User(body.Account_Id, body.Name + " " + body.Nachname, body.Uni);
              this.result.push(user);
            }
          });
        }
        break;
      }
      case "university-search-query": {
        if (this.result.length < this.pagesize) {
          json.forEach(element => {
            var found = false;
            var body = element.body;
            for (var i = 0; i < this.result.length; i++) {
              var id = this.result[i].id;
              if (id == body.Account_Id) {
                found = true;
                break;
              }
            }
            if (this.result.indexOf(body) < 0 && this.result.length < this.pagesize && !found) {
              var user = new User(body.Account_Id, body.Universität, body.Fachrichtungen);
              this.result.push(user);
            }
          });
        }
        break;
      }
      default: {
        break;
      }
    }
    if (this.infinityScroll != null) {
      this.infinityScroll.complete();
      if (this.result.length < this.pagesize) {
        this.infinityScroll.enabled = false;
      }
    }

  }

  search() {
    if (this.infinityScroll != null) {
      this.infinityScroll.enabled = true;
      this.infinityScroll = null;
    }
    this.pagesize = 4;
    this.result = [];
    if (this.filter != "") {
      this.searchForUser();
    }
  }

  searchForUser() {
    if (this.searchObject == 'Student') {
      this.searchForStudents();
    }

    if (this.searchObject == 'University') {
      this.searchForUniversity();
    }
  }

  searchForStudents() {
    if (this.searchParameterStudent.length > 0 && this.searchParameterStudent != "Name") {
      this.StudentTable.getAllContaining(this.searchParameterStudent, this.filter, "student-search-query", this.onComplete);
    } else if (this.searchParameterStudent.length > 0) {
      if (this.filter.indexOf(" ") !== -1) {
        var paras = this.filter.split(" ");
        paras.forEach(element => {
          this.StudentTable.getAllContaining("Name", this.filter, "first-name-search-query", this.onComplete);
        });
      } else {
        this.StudentTable.getAllContaining("Name", this.filter, "first-name-search-query", this.onComplete);
      }
    }
  }

  searchForUniversity() {
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

  loadMore(infinityScroll) {
    this.infinityScroll = infinityScroll;
    if (this.pagesize == this.result.length) {
      this.pagesize += 1;
      this.searchForUser();
    }else{
      this.infinityScroll.enabled = false;
    }
  }
}

class User {
  id: string;
  name: string;
  description: string;
  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}