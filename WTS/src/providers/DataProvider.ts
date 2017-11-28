import { Component, ViewChild , Injectable } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AccountTable } from '../providers/api/account';
import { ContactRequestTable } from '../providers/api/contactrequest';
import { StudentTable } from '../providers/api/student';
import { OnResultComplete } from '../providers/api/OnResultComplete';

/**
 * Service Class for getting Network information
 */
@Injectable()
export class DataProvider implements OnResultComplete{


    students = [];

    constructor(public storage: Storage, public navCtrl: NavController, public ContactRequestTable: ContactRequestTable, public StudentTable: StudentTable){
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
                this.students.push(new User(json.body.Account_Id, json.body.Name + " " + json.body.Nachname, json.body.Uni));
                console.log(this.students);
                break;
        }
    }


    searchForContacts(id) {
        this.ContactRequestTable.getAllContaining("receiver", id, "contact-query", this.onComplete);
        this.ContactRequestTable.getAllContaining("sender", id, "contact-query", this.onComplete);
    }


  loadMore(event:any){
    console.log("loading..");
  }

    public getStudents(){
        return this.students;
    }

}