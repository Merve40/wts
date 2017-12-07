import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { VisibilityTable } from '../../providers/api/visibility';

import * as moment from 'moment';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { BlockTable } from '../../providers/api/block';
import { Storage } from '@ionic/storage';


/**
 * Page for editing Student Profile.
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class Settings implements OnResultComplete{

  blocks = [];
  visibilityBlocks = [];

  accID: string; // AccountID die wir aus dem Login entnehmen

  personaltoggle = {
    toggle: true,
    block: undefined
  }
  studytoggle= {
    toggle: true,
    block:undefined
  }
  emailtoggle= {
    toggle: true,
    block: undefined
  }
  addresstoggle= {
    toggle: true,
    block: undefined
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService,
            public toastCtrl: ToastController, public blockTable:BlockTable, public visibility:VisibilityTable,
          public storage:Storage) {

    this.blockTable.setSrcClass(this);
    this.visibility.setSrcClass(this);
    this.storage.get("user_id").then( id => this.loadData(id) );
    
  }

  /**
   * Saves the changes made in settings to database
   */
  save() {
    for(let block of this.visibilityBlocks){
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
  changeSetting(togglebutton){
    togglebutton.block.body.Sichtbar = togglebutton.toggle;
    this.visibility.update(togglebutton.block.id, togglebutton.block.body, "", this.onComplete);
  }

  onComplete(src, json) {
    //Auslesen der Daten aus Tabelle Student where AccID = AccID

    if(src == "data"){
      console.log(json);
      if(json[0].body != null){
        //loads all visibility settings by the current users account id
       for(let obj of json){
          this.visibilityBlocks.push(obj);

          //iterates through the blocks to find the specific block and set it's boolean value 
          for(let block of this.blocks){

            if(obj.body.Block_Id == block.id){
            
              if(block.body.Block_Name == "Persönlich"){
                this.personaltoggle.toggle = obj.body.Sichtbar;
                this.personaltoggle.block = obj;
                break;

              }else if(block.body.Block_Name == "Email"){
                this.emailtoggle.toggle = obj.body.Sichtbar;
                this.emailtoggle.block = obj;
                break;

              }else if(block.body.Block_Name == "Studium"){
                this.studytoggle.toggle = obj.body.Sichtbar;
                this.studytoggle.block = obj;
                break;

              }else if (block.body.Block_Name == "Adresse"){
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

    for(var i = 0; i < blockNames.length; i++){
      this.blockTable.getByValue("Block_Name", blockNames[i], ""+i, (src, json)=>{

        this.blocks.push(json);
        var index = +src;
        //if the last entry was fetched then do the next request
        if(index+1 == blockNames.length){
          this.visibility.filterByValue("Account_Id", this.accID, "data", this.onComplete);
        }

      });
    }
    
  }
}