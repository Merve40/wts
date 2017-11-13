import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ContactRequestTable } from '../../providers/api/contactrequests';
import { ProfileVarier } from '../profile_varier/profile_varier';
import { OnResultComplete } from '../../providers/api/OnResultComplete';


@Component({
  selector: 'page-contact_request',
  templateUrl: 'contact_request.html'
})
export class ContactRequestPage implements OnResultComplete {

  accId;
  requests = [];

  constructor(public navCtrl: NavController, public ContactRequestTable: ContactRequestTable,public navParams: NavParams,) {
    ContactRequestTable.setSrcClass(this);
    this.accId = navParams.get("userId");
  }

  onComplete(src, json) {
    switch (src) {
      case "contact-request": {
        console.log("Started account abfrage in uni_profile");
        var body = json.body;
        console.log("json.body: " + body);
      }
      default: {
        break;
      }
    }
}

searchForRequests(){
this.ContactRequestTable.getByValue("receiver", this.accId, "contact-request", this.onComplete)
}

ngAfterViewInit() {
  this.searchForRequests();
}

}
