import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ContactRequestTable } from '../../providers/api/contactrequest';
import { StudentTable } from '../../providers/api/student';
import { ProfileVarier } from '../profile_varier/profile_varier';
import { OnResultComplete } from '../../providers/api/OnResultComplete';


import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-contact_request',
  templateUrl: 'contact_request.html'
})
export class ContactRequestPage implements OnResultComplete {

  accId;
  requests = [];

  constructor(public storage: Storage, public navCtrl: NavController, public ContactRequestTable: ContactRequestTable, public StudentTable: StudentTable) {
    ContactRequestTable.setSrcClass(this);
  }

  onComplete(src, json) {
    switch (src) {
      case "contact-request":
        console.log("Started request");
        var sender = json.body.sender;
        this.requests.push(sender);
        console.log("entry added");
        this.requests.forEach(element => {
          this.StudentTable.getByValue("Account_Id", element, "account-request", this.onComplete);
        });
        break;

      case "account-request":
        json.forEach(element => {
          var body = element.body;
          console.log(body);
        });
        break;
    }
  }

  searchForRequests(id) {
    this.accId = id;
    console.log("accId: " + this.accId);
    this.ContactRequestTable.getByValue("receiver", this.accId, "contact-request", this.onComplete);
  }

  ngAfterViewInit() {
    console.log("AfterView");
    this.storage.get("user_id").then((id) => this.searchForRequests(id));
  }

}
