import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AccountTable } from '../../../../providers/api/account';
import { ContactRequestTable } from '../../../../providers/api/contactrequest';
import { StudentTable } from '../../../../providers/api/student';
import { DataProvider } from '../DataProvider';

@Component({
    selector: 'student-tab',
    templateUrl: 'students.html'
})
export class StudentNetwork {

    students = [];

    constructor(public storage: Storage, public navCtrl: NavController, public ContactRequestTable: ContactRequestTable, public StudentTable: StudentTable) {
    var provider =  new DataProvider(storage, navCtrl, ContactRequestTable, StudentTable);
    this.students = provider.getData();
    }


    ngAfterViewInit() {
        console.log("start");
        this.storage.get("user_id").then((id) => this.searchForContacts(id));
    }

    searchForContacts(id) {
        this.ContactRequestTable.getAllContaining("reciever", id, "contact-query", this.onComplete);
        this.ContactRequestTable.getAllContaining("sender", id, "contact-query", this.onComplete);
    }

    loadMore(event: any) {
        console.log("loading..");
    }
}