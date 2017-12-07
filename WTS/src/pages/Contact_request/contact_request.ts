import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ContactRequestTable } from '../../providers/api/contactrequest';
import { StudentTable } from '../../providers/api/student';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular/util/events';


@Component({
  selector: 'page-contact_request',
  templateUrl: 'contact_request.html'
})
export class ContactRequestPage implements OnResultComplete {

  students = [];
  accId;

  constructor(public storage: Storage, public navCtrl: NavController, public translate: TranslateService, public toastCtrl: ToastController, public ContactRequestTable: ContactRequestTable,
    public StudentTable: StudentTable, public events:Events) {
    ContactRequestTable.setSrcClass(this);
    StudentTable.setSrcClass(this);
  }

  onComplete(src, json) {
    switch (src) {
      case "contact-request":
        for (var i = 0; i < json.length; i++) {
          if (json[i].body == null) {
            break;
          }
          
          else {
            var sender = json[i].body.sender;
            var request = json[i].body.request;
            console.log(json[i]);
            if (request == false) {
              console.log("sender: "+sender);
              //TODO: für alle User implementieren!!
              this.StudentTable.getByValue("Account_Id", sender, "account-request", this.onComplete);
            }
          }
        };
        break;

      case "account-request":
        console.log(json);
        this.students.push(new User(json.body.Account_Id, json.body.Name + " " + json.body.Nachname, json.body.Uni));
        break;

      case "accept-request":
        var contactbody = json.body;
        contactbody.request = true;
        var contactid = json.id;
        this.events.publish("user-added", contactid);
        this.ContactRequestTable.update(contactid, contactbody, "reload-request", this.onComplete);
        break;

      case "reload-request":
      this.translate.get('CONTACTADDED').subscribe(
        value => {
          this.showContactAddedMessage(value);
        });
      this.storage.get("user_id").then((id) => this.searchForRequests(id));
        break;
        
      case "delete-request":
       console.log(json.id);
       var contactId = json.id;
       this.ContactRequestTable.delete(contactId, "delete-contact", this.onComplete);
    }
  }

  showContactAddedMessage(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  accept(id) {
    this.ContactRequestTable.getByValue("sender", id, "accept-request", this.onComplete);
  }

  removeRequest(id){
    this.ContactRequestTable.getByValue("sender", id, "delete-request", this.onComplete);
  }

  searchForRequests(id) {
    this.students = [];
    this.accId = id;
    console.log("accId: " + this.accId);
    this.ContactRequestTable.filterByValue("receiver", this.accId, "contact-request", this.onComplete);
  }

  ngAfterViewInit() {
    console.log("AfterView");
    this.storage.get("user_id").then((id) => this.searchForRequests(id));
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