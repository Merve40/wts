import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { VisibilityTable } from '../../providers/api/visibility';

import * as moment from 'moment';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { BlockTable } from '../../providers/api/block';
import { Storage } from '@ionic/storage';
import { SettingsVisibility } from './settings_visibility/settings_visibility';


/**
 * Page for editing Student Profile.
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class Settings implements OnResultComplete {

  blocks = [];
  visibilityBlocks = [];

  accID: string; // AccountID die wir aus dem Login entnehmen

  personaltoggle = {
    toggle: true,
    block: undefined
  }
  studytoggle = {
    toggle: true,
    block: undefined
  }
  emailtoggle = {
    toggle: true,
    block: undefined
  }
  addresstoggle = {
    toggle: true,
    block: undefined
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService,
    public toastCtrl: ToastController, public blockTable: BlockTable, public visibility: VisibilityTable,
    public storage: Storage) {

    this.blockTable.setSrcClass(this);
    this.visibility.setSrcClass(this);
    this.storage.get("user_id").then(id => this.loadData(id));

  }

  navigateToVisibility(isExtern){
    console.log("clicked!");
    this.navCtrl.push(SettingsVisibility);
  }

  /**
   * Saves the changes made in settings to database
   */
  save() {
    for (let block of this.visibilityBlocks) {
      this.visibility.update(block.id, block.body, "", this.onComplete);
    }
  }

  discardChanges() {
    this.loadData(this.accID);
  }

  /**
   * Changes the visibility of the specific setting
   * @param togglebutton button that is being clicked / toggled
   */
  changeSetting(togglebutton) {
    togglebutton.block.body.Sichtbar = togglebutton.toggle;
    this.visibility.update(togglebutton.block.id, togglebutton.block.body, "", this.onComplete);
  }

  onComplete(src, json) {
    //Auslesen der Daten aus Tabelle Student where AccID = AccID

    if(!json){
      return;
    }

    if (src == "data") {
      console.log(json);
      if (json.length > 0) {
        //loads all visibility settings by the current users account id
        for (let obj of json) {
          this.visibilityBlocks.push(obj);

          //iterates through the blocks to find the specific block and set it's boolean value 
          for (let block of this.blocks) {

            if (obj.body.Block_Id == block.id) {

              if (block.body.Block_Name == "personal") {
                this.personaltoggle.toggle = obj.body.Sichtbar;
                this.personaltoggle.block = obj;
                break;

              } else if (block.body.Block_Name == "email") {
                this.emailtoggle.toggle = obj.body.Sichtbar;
                this.emailtoggle.block = obj;
                break;

              } else if (block.body.Block_Name == "study") {
                this.studytoggle.toggle = obj.body.Sichtbar;
                this.studytoggle.block = obj;
                break;

              } else if (block.body.Block_Name == "address") {
                this.addresstoggle.toggle = obj.body.Sichtbar;
                this.addresstoggle.block = obj;
                break;

              }
            }
          }

        }
      }
    }

  }

  loadData(id) {
    console.log("loading data..");
    this.accID = id;
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

  isContact(id, userId):boolean{
    //TODO
    return false
  }
}

enum VisibilityBlock {
  //INTERN-STUDENT
  INTERN_STUDENT_ADDRESS = "intern_student_address",
  INTERN_STUDENT_EMAIL = "intern_student_email",
  INTERN_STUDENT_STUDY = "intern_student_study",
  INTERN_STUDENT_PERSONAL = "intern_student_personal",
  //INTERN-COMPANY
  INTERN_COMPANY_ADDRESS = "intern_company_address",
  INTERN_COMPANY_EMAIL = "intern_company_email",
  INTERN_COMPANY_STUDY = "intern_company_study",
  INTERN_COMPANY_PERSONAL = "intern_company_personal",
  //INTERN-UNI
  INTERN_UNI_ADDRESS = "intern_uni_address",
  INTERN_UNI_EMAIL = "intern_uni_email",
  INTERN_UNI_STUDY = "intern_uni_study",
  INTERN_UNI_PERSONAL = "intern_company_personal",
  //EXTERN-STUDENT
  EXTERN_STUDENT_ADDRESS = "extern_student_address",
  EXTERN_STUDENT_EMAIL = "extern_student_email",
  EXTERN_STUDENT_STUDY = "extern_student_study",
  EXTERN_STUDENT_PERSONAL = "extern_student_personal",
  //EXTERN-COMPANY
  EXTERN_COMPANY_ADDRESS = "extern_company_address",
  EXTERN_COMPANY_EMAIL = "extern_company_email",
  EXTERN_COMPANY_STUDY = "extern_company_study",
  EXTERN_COMPANY_PERSONAL = "extern_company_personal",
  //EXTERN-UNI
  EXTERN_UNI_ADDRESS = "extern_uni_address",
  EXTERN_UNI_EMAIL = "extern_uni_email",
  EXTERN_UNI_STUDY = "extern_uni_study",
  EXTERN_UNI_PERSONAL = "extern_uni_personal",
}