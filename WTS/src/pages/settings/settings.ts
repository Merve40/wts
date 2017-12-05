import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { VisibilityTable } from '../../providers/api/visibility';

import * as moment from 'moment';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { BlockTable } from '../../providers/api/block';


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
  personalInfo:boolean;
  universityInfo:boolean;
  emailInfo:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService,
            public toastCtrl: ToastController, public blockTable:BlockTable, public visibility:VisibilityTable) {

    this.blockTable.setSrcClass(this);
    this.visibility.setSrcClass(this);
    this.accID = navParams.get("userId");
    this.loadData();
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
    this.loadData();
  }

  onComplete(src, json) {
    //Auslesen der Daten aus Tabelle Student where AccID = AccID

    if(src == "data"){
      if(json[0].body != null){
        //loads all visibility settings by the current users account id
        for(let obj of json){
          this.visibilityBlocks.push(obj);

          //iterates through the blocks to find the specific block and set it's boolean value 
          for(let block of this.blocks){

            if(obj.body.Block_Id == block.id){
              if(block.body.Block_Name == "Persönlich"){
                this.personalInfo = obj.body.Sichtbar;
                break;

              }else if(obj.body.Block_Name == "Email"){
                this.emailInfo = obj.body.Sichtbar;
                break;

              }else if(obj.body.Block_Name == "Studium"){
                this.universityInfo = obj.body.Sichtbar;
                break;
              }
            }
          }

        }
      }
    }

  }

  loadData() {
    var blockNames = ["Persönlich", "Email", "Studium"];

    for(var i = 0; i < blockNames.length; i++){
      this.blockTable.getByValue("Block_Name", blockNames[i], ""+i, (src, json)=>{
        this.blocks.push(json);
        var index = +src;
        //if the last entry was fetched then do the next request
        if(index+1 == this.blocks.length){
          this.visibility.filterByValue("Account_Id", this.accID, "data", this.onComplete);
        }
      });
    }
    
  }
}