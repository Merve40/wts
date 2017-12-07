import { Component, ViewChild, Injectable } from '@angular/core';
import { AccountTable } from '../providers/api/account';
import { ContactRequestTable } from '../providers/api/contactrequest';
import { StudentTable } from '../providers/api/student';
import { CompanyTable } from '../providers/api/company';
import { UniversityTable } from '../providers/api/university';
import { OnResultComplete } from '../providers/api/OnResultComplete';
import { Storage } from '@ionic/storage';

/**
 * Service Class for getting Network information
 */
@Injectable()
export class DataProvider implements OnResultComplete {

    user = [];
    userid;

    constructor(public storage: Storage, public ContactRequestTable: ContactRequestTable, 
        public StudentTable: StudentTable, public UniversityTable: UniversityTable, public CompanyTable: CompanyTable) {
        ContactRequestTable.setSrcClass(this);
        StudentTable.setSrcClass(this);
        UniversityTable.setSrcClass(this);
        CompanyTable.setSrcClass(this);
        this.storage.get("user_id").then((id) => this.searchForAllContacts(id));
    }

    onComplete(src, json) {
        // console.log("this in dataprovider: ");
        // console.log(this.UniversityTable);
        switch (src) {
            case "contact-query":
                if (json[0] == null) return;
                for (var i = 0; i < json.length; i++) {
                    if (json[i].body == null) {
                        break;
                    }
                    else {
                        var sender = json[i].body.sender;
                        var receiver = json[i].body.receiver;
                        var request = json[i].body.request;
                        if (request == true) {
                            if (sender != this.userid) {
                                this.StudentTable.getByValue("Account_Id", sender, "student-request", this.onComplete);
                                this.UniversityTable.getByValue("Account_Id", sender, "university-request", this.onComplete);
                                this.CompanyTable.getByValue("Account_Id", sender, "company-request", this.onComplete);
                            } else if (receiver != this.userid) {
                                this.StudentTable.getByValue("Account_Id", receiver, "student-request", this.onComplete);
                                this.UniversityTable.getByValue("Account_Id", receiver, "university-request", this.onComplete);
                                this.CompanyTable.getByValue("Account_Id", receiver, "company-request", this.onComplete);
                            }
                        }
                    }
                };
                break;

            case "student-request":
                if (json.body == null) return;

                console.log("0");
                console.log(json);
                var student = new User(json.body.Account_Id, json.body.Name + " " + json.body.Nachname, json.body.Uni);
                console.log(student);
                student.usergroup = "group_1";
                this.user.push(student);
                break;

            case "company-request":
                if (json.body == null) return;
                var company = new User(json.body.Account_Id, json.body.Unternehmen, json.body.Branche);
                company.usergroup = "group_2";
                this.user.push(company);
                break;

            case "university-request":
                if (json.body == null) return;
                var university = new User(json.body.Account_Id, json.body.Universität, json.body.Fachrichtungen);
                university.usergroup = "group_3";
                this.user.push(university);
                break;
        }
    }

    searchForAllContacts(id) {
        this.userid = id
        this.ContactRequestTable.filterByValue("receiver", id, "contact-query", this.onComplete);
        this.ContactRequestTable.filterByValue("sender", id, "contact-query", this.onComplete);
    }

    public getUser() {
        return this.user;
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