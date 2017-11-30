import { Component, ViewChild, Injectable } from '@angular/core';
import { AccountTable } from '../providers/api/account';
import { ContactRequestTable } from '../providers/api/contactrequest';
import { StudentTable } from '../providers/api/student';
import { OnResultComplete } from '../providers/api/OnResultComplete';
import { Storage } from '@ionic/storage';

/**
 * Service Class for getting Network information
 */
@Injectable()
export class DataProvider implements OnResultComplete {

    students = [];

    constructor(public storage: Storage, public ContactRequestTable: ContactRequestTable, public StudentTable: StudentTable) {
        ContactRequestTable.setSrcClass(this);
        StudentTable.setSrcClass(this);
        console.log("start");
        this.storage.get("user_id").then((id) => this.searchForContacts(id));
    }

    onComplete(src, json) {
        switch (src) {
            case "contact-query":
                for (var i = 0; i < json.length; i++) {
                    if (json[i].body == null) {
                        break;
                    }
                    else {
                        var sender = json[i].body.sender;
                        var receiver = json[i].body.receiver;
                        var request = json[i].body.request;
                        if (request == true) {
                            this.StudentTable.getByValue("Account_Id", sender, "account-request", this.onComplete);
                            this.StudentTable.getByValue("Account_Id", receiver, "account-request", this.onComplete);
                        }
                    }
                };
                break;
            case "account-request":
                var user = new User(json.body.Account_Id, json.body.Name + " " + json.body.Nachname, json.body.Uni);
                user.usergroup = "gruppe_1";
                this.students.push(user);
                console.log(this.students);
                break;
        }
    }

    searchForContacts(id) {
        this.ContactRequestTable.filterByValue("receiver", id, "contact-query", this.onComplete);
        this.ContactRequestTable.filterByValue("sender", id, "contact-query", this.onComplete);
    }


  loadMore(event:any){
    console.log("loading...");
  }

    public getStudents() {
        return this.students;
    }

}

class User {
    id: string;
    name: string;
    description: string;
    usergroup: string;
    constructor(id: string, name: string, description: string) {
      this.id = id;
      this.name = name;
      this.description = description;
    }
  }