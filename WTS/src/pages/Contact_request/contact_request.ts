import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';
import { ContactRequestTable } from '../../providers/api/contactrequest';
import { StudentTable } from '../../providers/api/student';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-contact_request',
  templateUrl: 'contact_request.html'
})
export class ContactRequestPage implements OnResultComplete {

  students = [];
  accId;
  requests = [];

  constructor(public storage: Storage, public navCtrl: NavController, public ContactRequestTable: ContactRequestTable, 
              public StudentTable: StudentTable) {
    ContactRequestTable.setSrcClass(this);
    StudentTable.setSrcClass(this);
  }

  onComplete(src, json) {
    switch (src) {
      case "contact-request":
        for (var i = 0; i < json.length; i++) {
          var sender = json[i].body.sender;
          this.StudentTable.getByValue("Account_Id", sender, "account-request", this.onComplete);
        };
        break;

      case "account-request":
        this.students.push(new Student(json.body.Account_Id, json.body.Name + " " + json.body.Nachname, json.body.Uni));
        break;

      case "accept-request":
        var contactbody = json.body;
        var contactid = json.id;
        contactbody.request = true;
        this.ContactRequestTable.update(contactid, contactbody, "", function (flag, json) {
        });
    }
  }

  accept(id) {
    this.ContactRequestTable.getByValue("sender", id, "accept-request", this.onComplete);

    //this.ContactRequestTable.update(this.id, this.contactbody, "", function (flag, json) { 
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
    //}); 
  }

  searchForRequests(id) {
    this.accId = id;
    console.log("accId: " + this.accId);
    this.ContactRequestTable.filterByValue("receiver", this.accId, "contact-request", this.onComplete);
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