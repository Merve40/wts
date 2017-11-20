import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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

  students = [];
  id;
  contactbody;
  accId;
  requests = [];

  constructor(public storage: Storage, public navCtrl: NavController, public ContactRequestTable: ContactRequestTable, public StudentTable: StudentTable) {
    ContactRequestTable.setSrcClass(this);
    StudentTable.setSrcClass(this);
  }

  onComplete(src, json) {
    switch (src) {
      case "contact-request":
        console.log("Started request");
        this.contactbody = json.body;
        this.id = json.id;
        var sender = json.body.sender;
        this.requests.push(sender);
        console.log("entry added");
        for (var i = 0; i < this.requests.length; i++) {
          if(json.body.request == false){
          this.StudentTable.getByValue("Account_Id", this.requests, "account-request", this.onComplete);
        }};
        break;

      case "account-request":
      console.log("test");
        this.students.push(new Student(json.body.Account_Id, json.body.Name + " " + json.body.Nachname, json.body.Uni));
        console.log(this.students);
        break;
    }
  }

  accept(){
    this.contactbody.request = true;
    this.ContactRequestTable.update(this.id, this.contactbody, "", function (flag, json) {
      /*
      if(json){
        
        this.translate.get("SAVED_CHANGES").subscribe( value =>{
          const toast = this.toastCtrl.create({
            message: "Kontakt erfolgreich hinzugefügt",
            duration: 3000,
            position: 'top'
          });
          toast.present();
        });
      }
      */
    });
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
class Student {
  id: string;
  name: string;
  university: string;
  constructor(id: string, name: string, university: string) {
    this.id = id;
    this.name = name;
    this.university = university;
  }
}