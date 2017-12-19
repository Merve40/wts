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

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class StudentProfilePage implements OnResultComplete {

  accID: string;
  accID_extern: string;
  isOwn: boolean;

  //visibility settings
  addressIsVisible: boolean = true;
  mailIsVisible: boolean = true;
  personalIsVisible: boolean = true;
  studyIsVisible: boolean = true;
  blocks = [];

  hasContact: boolean;
  canRemove: boolean;
  contactId: string;
  @ViewChild('myButton') button: Button;
  @ViewChild('myButton2') button2: Button;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,
    public AdressTable: AdressTable, public ContactRequestTable: ContactRequestTable, public StudentTable: StudentTable,
    public AccountTable: AccountTable, public StudentSkillTable: Student_SkillTable, public SkillTable: SkillTable,
    public PassionTable: PassionTable, public StudentPassionTable: Student_PassionTable, public blockTable: BlockTable,
    public visibility: VisibilityTable, public modal: ModalController, ) {

    visibility.setSrcClass(this);
    blockTable.setSrcClass(this);
    StudentTable.setSrcClass(this);
    AccountTable.setSrcClass(this);
    AdressTable.setSrcClass(this);
    StudentSkillTable.setSrcClass(this);
    SkillTable.setSrcClass(this);
    PassionTable.setSrcClass(this);
    StudentPassionTable.setSrcClass(this);
    ContactRequestTable.setSrcClass(this);

    this.accID = navParams.get("userId");
    this.isOwn = navParams.get("isOwn");
    this.hasContact = navParams.get("hasContact");
    this.canRemove = !this.isOwn && this.hasContact;

    console.log("Profile.ts: IsOwn is: " + this.isOwn);
    console.log("Has Contact ? " + this.hasContact);
    this.load();
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

      this.fetchVisibility();

    } else {
      console.log("Profile is own, printed in profile.ts");
      this.StudentTable.getByValue("Account_Id", this.accID, "student-abfrage", this.onComplete);
      this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
      this.StudentPassionTable.filterByValue("Account_Id", this.accID, "passionStudent-abfrage", this.onComplete);
      this.StudentSkillTable.filterByValue("Account_Id", this.accID, "skill-abfrage", this.onComplete);
    }
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

  removeContact() {
    console.log(" contact ID : " + this.contactId);
    this.ContactRequestTable.delete(this.contactId, "delete-contact", this.onComplete);
  }

  edit() {
    this.navCtrl.push(Profile_EditPage, { userId: this.accID });
  }

  /**
   * Retrieves visibility blocks for displaying/hiding profile information.
   */
  fetchVisibility() {
    var blockNames = ["Persönlich", "Email", "Studium", "Adresse"];

    for (var i = 0; i < blockNames.length; i++) {
      this.blockTable.getByValue("Block_Name", blockNames[i], "" + i, (src, json) => {
        if(!json){
          return;
        }
        this.blocks.push(json);
        var index = +src;
        //if the last entry was fetched then do the next request
        if (index + 1 == blockNames.length) {
          this.visibility.filterByValue("Account_Id", this.accID, "data", this.onComplete);
        }

      });
    }
  }

  /**
   * Sets the boolean values to the corresponding value in DB.
   * @param json data in JSON-Format
   */
  configureVisibility(json) {
    console.log(json);
    //loads all visibility settings by the current users account id
    for (let obj of json) {
      //iterates through the blocks to find the specific block and set it's boolean value 
      for (let block of this.blocks) {

        if (obj.body.Block_Id == block.id) {
          if (block.body.Block_Name == "Persönlich") {
            this.personalIsVisible = obj.body.Sichtbar;
            break;

          } else if (block.body.Block_Name == "Email") {
            this.mailIsVisible = obj.body.Sichtbar;
            break;

          } else if (block.body.Block_Name == "Studium") {
            this.studyIsVisible = obj.body.Sichtbar;
            break;

          } else if (block.body.Block_Name == "Adresse") {
            this.addressIsVisible = obj.body.Sichtbar;
            break;

          }
        }
      }
    }
  }

  onComplete(src, json) {

    if(!json){
      return;
    }

    if (src == "data") {
      this.configureVisibility(json);
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
            console.log(found);
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
            console.log(found);
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

      if (this.studyIsVisible) {
        document.getElementById("uni").innerText = body.Uni;
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

      if (this.addressIsVisible) {
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
            console.log(num);
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
  }
}