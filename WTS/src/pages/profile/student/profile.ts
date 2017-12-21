import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Button, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Profile_EditPage } from '../edit/profile_edit'
import { StudentTable } from '../../../providers/api/student';
import { AccountTable } from '../../../providers/api/account';
import { ContactRequestTable } from '../../../providers/api/contactrequest';
import { AdressTable } from '../../../providers/api/adress';
import { Student_SkillTable } from '../../../providers/api/student_skill';
import { SkillTable } from '../../../providers/api/skill';
import { Student_PassionTable } from '../../../providers/api/student_passion';
import { PassionTable } from '../../../providers/api/passion';
import { OnResultComplete } from '../../../providers/api/OnResultComplete';
import { BlockTable } from '../../../providers/api/block';
import { VisibilityTable } from '../../../providers/api/visibility';
import { ModalContact } from './modal/modal_contact';
import { MessagePage } from '../../message/message_item/message_item';
import { NotificationService, NotificationEvent } from '../../../providers/notification_service';
import { ConversationTable } from '../../../providers/api/conversation';
import { VisibilityService } from '../../../providers/visibility_service';


export interface MessageItem {
  id: string;
  userName: string;
  img: string;
  lastMessage: string;
  dateTime: string;
  read: boolean;
  imgSource: string;
}
export interface ConversationItem {
  id: string;
  body: {
    Account_Id_1: string;
    Account_Id_2: string;
    Zeitstempel: any;
  }
}


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class StudentProfilePage implements OnResultComplete {

  accID: string;
  accID_extern: string;
  isOwn: boolean;

  addressIsVisible: boolean = true;
  mailIsVisible: boolean = true;
  personalIsVisible: boolean = true;
  studyIsVisible: boolean = true;
  blocks = [];

  hasContact: boolean;
  canRemove: boolean;
  contactId: string;
  canSend: boolean;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,
    public AdressTable: AdressTable, public ContactRequestTable: ContactRequestTable, public StudentTable: StudentTable,
    public AccountTable: AccountTable, public StudentSkillTable: Student_SkillTable, public SkillTable: SkillTable,
    public PassionTable: PassionTable, public StudentPassionTable: Student_PassionTable, public modal: ModalController,
    public notificationService: NotificationService, public conversationTable: ConversationTable,
    public visibilityService: VisibilityService) {

    StudentTable.setSrcClass(this);
    AccountTable.setSrcClass(this);
    AdressTable.setSrcClass(this);
    StudentSkillTable.setSrcClass(this);
    SkillTable.setSrcClass(this);
    PassionTable.setSrcClass(this);
    StudentPassionTable.setSrcClass(this);
    ContactRequestTable.setSrcClass(this);
    conversationTable.setSrcClass(this);

    this.accID = navParams.get("userId");
    this.isOwn = navParams.get("isOwn");
    this.hasContact = navParams.get("hasContact");
    this.canRemove = !this.isOwn && this.hasContact;
    this.canSend = navParams.get("canSend");


    console.log("Profile.ts: IsOwn is: " + this.isOwn);
    console.log("Has Contact ? " + this.hasContact);
    console.log("Can Send:" + this.canSend);
  }

  load() {
    if (this.isOwn == false) {
      console.log("Profile is extern, printed in profile.ts");
      this.accID = this.navParams.get("userId");
      this.StudentTable.getByValue("Account_Id", this.accID, "student-abfrage", this.onComplete);
      this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
      this.StudentPassionTable.filterByValue("Account_Id", this.accID, "passionStudent-abfrage", this.onComplete);
      this.StudentSkillTable.filterByValue("Account_Id", this.accID, "skill-abfrage", this.onComplete);

      this.storage.get("user_id").then((id) => {
        this.accID_extern = id;
        this.ContactRequestTable.filterByValue("receiver", this.accID_extern, "receiversearch-query", this.onComplete);
      });

    } else {
      console.log("Profile is own, printed in profile.ts");
      this.StudentTable.getByValue("Account_Id", this.accID, "student-abfrage", this.onComplete);
      this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
      this.StudentPassionTable.filterByValue("Account_Id", this.accID, "passionStudent-abfrage", this.onComplete);
      this.StudentSkillTable.filterByValue("Account_Id", this.accID, "skill-abfrage", this.onComplete);
    }
  }

  mail() {
    var reveiverID = this.accID
    //var senderID = 
    //Wenn Chat besteht: Chat öffnen
    //this.navigateToUserProfile()
    //Ansonsten: NEuen Chat aufmachen
  }


  sendRequest() {
    let contactModal = this.modal.create(ModalContact, { receiver: this.accID });

    contactModal.onDidDismiss(data => {
      if (data) {
        this.ContactRequestTable.push(data, "contactrequest", this.onComplete);
      }
    });
    contactModal.present();
  }

  getConversation() {
    this.conversationTable.filterByValue("Account_Id_1", this.accID, "conversation", this.onComplete);
  }

  sendMessage(convId) {
    var user = {
      id: convId, userName: document.getElementById("name").innerText, img: "", lastMessage: "", dateTime: "07.12.2017", read: true,
      imgSource: "assets/img/student-image.png"
    };

    //notifies everyone listening on this topic that message was read
    this.navCtrl.push(MessagePage, { id: user.id, name: user.userName, imgSource: user.imgSource });
  }

  removeContact() {
    console.log(" contact ID : " + this.contactId);
    this.ContactRequestTable.delete(this.contactId, "delete-contact", this.onComplete);
  }

  edit() {
    this.navCtrl.push(Profile_EditPage, { userId: this.accID });
  }


  onComplete(src, json) {

    if (!json) {
      return;
    }

    if (src == "contactrequest") {
      this.contactId = json.name;
      this.hasContact = true;
      this.canRemove = !this.isOwn && this.hasContact;
    }

    if (src == "receiversearch-query") {
      console.log(json);
      if (json.length == 0) {
        this.ContactRequestTable.filterByValue("sender", this.accID_extern, "sendersearch-query", this.onComplete);
      }
      else {
        var found = false;
        for (var i = 0; i < json.length; i++) {
          if (json[i].body.sender == this.accID) {
            found = true;
            this.contactId = json[i].id;
            break;
          }
        }
        if (found == false) {
          this.ContactRequestTable.filterByValue("sender", this.accID_extern, "sendersearch-query", this.onComplete);
        }
      }
    }

    if (src == "sendersearch-query") {
      console.log(json);
      if (json.length == 0) {
        var receiver_id = this.accID;
        var contact = {
          sender: this.accID_extern,
          request: false,
          receiver: receiver_id,
          message: "",
          Zeitstempel: this.ContactRequestTable.TIMESTAMP
        }
        this.ContactRequestTable.push(contact, "contactrequest", this.onComplete);
      }
      else {
        var found = false;
        for (var i = 0; i < json.length; i++) {
          if (json[i].body.receiver == this.accID) {
            found = true;
            this.contactId = json[i].id;
            break;
          }
        }
        if (found == false) {
          this.hasContact = false;
          this.canRemove = !this.isOwn && this.hasContact;
        } else {
          this.hasContact = true;
          this.canRemove = !this.isOwn && this.hasContact;
        }
      }

    }

    if (src == "delete-contact") {
      this.hasContact = false;
      this.canRemove = !this.isOwn && this.hasContact;
    }


    //Auslesen der Daten aus Tabelle Student where AccID = AccID
    if (src == "student-abfrage") {
      var body = json.body;
      var name = json.body.Name + " " + json.body.Nachname;

      document.getElementById("name").innerText = name;
      if (this.personalIsVisible) {
        document.getElementById("dateOfBirth").innerText = body.Geb_Datum == "" || body.Geb_Datum == null ? "01.01.1971" : body.Geb_Datum;
      }

      document.getElementById("uni").innerText = body.Uni;

      if (this.studyIsVisible) {
        document.getElementById("studyProgram").innerText = body.Studiengang;
        document.getElementById("degree").innerText = body.Abschluss;
        document.getElementById("studyProgress").innerText = body.Semester;
        document.getElementById("endOfStudy").innerText = body.Abschluss_Datum;
      }

    }
    //Auslesen der Daten aus Tabelle Account
    if (src == "account-abfrage") {
      var body = json.body;
      var adresse_id = body.Adresse_id;

      if (this.mailIsVisible) {
        document.getElementById("email").innerText = body.Email;
      }

      //Verschachtelte Abfrage Account mit Adresse
      this.AdressTable.getById(adresse_id, "adresse-abfrage", this.onComplete);
    }

    //Auslesen der Daten aus Tabelle Adresse
    if (src == "adresse-abfrage") {
      var body = json.body;
      var adresse = body.Straße + ', ' + body.PLZ + ', ' + body.Land;

      if (this.addressIsVisible) {
        document.getElementById("address").innerText = adresse;
      }
    }
    //Auslesen der Daten aus Tabelle Leidenschaft
    if (src == "passionStudent-abfrage") {
      //überprüft erst ob Leidenschaft existiert
      if (json.length > 0) {
        var passions = "";

        for (var i = 0; i < json.length; i++) {
          var item = json[i];

          //anonymer Aufruf
          let asyncCall: Function = (source, _json) => {

            var num = +source;
            passions += _json.body.Leidenschaft;

            if (num + 1 < json.length) {
              passions += ", ";
            } else {
              if (this.personalIsVisible) {
                document.getElementById("interests").innerText = passions;
              }
            }

          }

          this.PassionTable.getById(item.body.Leidenschaft_Id, "" + i, asyncCall);
        }

      } else {
        if (this.personalIsVisible) {
          document.getElementById("interests").className = "hidden";
        }
      }
    }

    if (src == "skill-abfrage") {
      //überprüft erst ob Fähigkeit existiert
      if (json.length > 0) {

        var body = json;
        var skills = "";

        for (var i = 0; i < json.length; i++) {
          var item = json[i];

          //anonymer Aufruf
          let asyncCall: Function = (source, _json) => {
            var num = +source;
            skills += _json.body.Fähigkeit;

            if (num + 1 < json.length) {
              skills += ", ";
            } else {
              if (this.personalIsVisible) {
                document.getElementById("skills").innerText = skills;
              }
            }
          }

          this.SkillTable.getById(item.body.Fähigkeit_Id, "" + i, asyncCall);
        }

      } else {
        if (this.personalIsVisible) {
          document.getElementById("skills").className = "hidden";
        }
      }
    }

    if (src == "conversation") {
      if (json.length > 0) {
        var arr: ConversationItem[] = json as ConversationItem[];
        arr.forEach(element => {
          if (element.body.Account_Id_2 == this.accID) {
            this.sendMessage(element.id);
            return;
          }
        });
      }
      this.conversationTable.filterByValue("Account_Id_2", this.accID, "conversation2", this.onComplete);
    }
    if (src == "conversation2") {
      if (json.length > 0) {
        var arr: ConversationItem[] = json as ConversationItem[];
        arr.forEach(element => {
          if (element.body.Account_Id_1 == this.accID) {
            this.sendMessage(element.id);
            return;
          }
        });
      }
      //creates new conversation, if it does not exist already
      this.storage.get("user_id").then(id => {
        var conversation = {
          Account_Id_1: id,
          Account_Id_2: this.accID,
          Zeitstempel: this.conversationTable.TIMESTAMP
        };
        this.conversationTable.push(conversation, "", (src, js) => {
          this.sendMessage(js.name);
        });
      });
    }
  }

  ngAfterViewInit() {
    console.log("loading..");
    if (!this.isOwn) {
      this.visibilityService.load(this.accID).then(blocks => {
        blocks.forEach(block => {
          if (block.key == "address") {
            this.addressIsVisible = block.value;
          } else if (block.key == "study") {
            this.studyIsVisible = block.value;
          } else if (block.key == "email") {
            this.mailIsVisible = block.value;
          } else if (block.key == "personal") {
            this.personalIsVisible = block.value;
          }
        });
        this.load();
      });


    } else {
      this.load();
    }
  }
}