import { Component, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ContactRequestTable } from '../../providers/api/contactrequest';
import { StudentTable } from '../../providers/api/student';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';


@Component({
  selector: 'page-contact_request',
  templateUrl: 'contact_request.html'
})
export class ContactRequestPage implements OnResultComplete {

  students: User[] = [];
  accId;

  constructor(public storage: Storage, public navCtrl: NavController, public translate: TranslateService, public toastCtrl: ToastController, public ContactRequestTable: ContactRequestTable,
    public StudentTable: StudentTable, public events: Events, public zone: NgZone) {
    ContactRequestTable.setSrcClass(this);
    StudentTable.setSrcClass(this);

    //is triggered when a new contact-request is made
    events.subscribe("contact-requested", (data) => {
      zone.run(() => {
        this.StudentTable.getUserTypeByAccountId(data.sender, "", (src, _json) => {
          console.log("event: contact-requested");
          var body = { sender: data.sender, request: false, receiver: data.receiver };
          var user = this.addUser({ id: data.contactId, body: body }, _json);
          this.students.push(user);
        });
      });
    });
  }

  onComplete(src, json) {
    if (src == "contact-request") {
      for (var i = 0; i < json.length; i++) {
        if (json[i].body == null) {
          break;
        } else {
          var sender = json[i].body.sender;
          var request = json[i].body.request;
          if (!request) {
            var data = json[i];

            this.StudentTable.getUserTypeByAccountId(sender, "", (src, _json) => {
              var user = this.addUser(data, _json);
              this.students.push(user);
            });
          }
        }
      }
    }
  }

  addUser(data, _json): User {
    var user: User;

    if (_json.type == "gruppe_1") {
      user = new User(_json.body.Account_Id, _json.body.Name + " " + _json.body.Nachname, _json.body.Uni);

    } else if (_json.type == "gruppe_2") {
      user = new User(_json.body.Account_Id, _json.body.Unternehmen, _json.body.Branche);

    }
    user.json = data;
    return user;
  }

  showContactAddedMessage() {
    this.translate.get('CONTACTADDED').subscribe(
      value => {
        const toast = this.toastCtrl.create({
          message: value,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
  }

  accept(item: User) {
    item.json.body.request = true;
    this.ContactRequestTable.update(item.json.id, item.json.body, "", (s, j) => { });
    var index = this.students.indexOf(item);
    if (index > -1) {
      this.students.splice(index, 1);
      this.showContactAddedMessage();
    }
  }

  removeRequest(item: User) {
    this.ContactRequestTable.delete(item.json.id, "", (s, j) => { });
    var index = this.students.indexOf(item);
    if (index > -1) {
      this.students.splice(index, 1);
    }
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
  json: any;
  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}