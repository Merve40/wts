import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccountTable } from '../../../providers/api/account';
import { AdressTable } from '../../../providers/api/adress';
import {UniversityTable} from '../../../providers/api/university';
import { OnResultComplete } from '../../../providers/api/OnResultComplete';

@Component({
  selector: 'page-uni_profile',
  templateUrl: 'profile.html'
})
export class UniProfilePage implements OnResultComplete {

  accID:string;

  constructor(public storage:Storage, public navCtrl: NavController, public navParams: NavParams, public AdressTable:AdressTable, 
    public AccountTable: AccountTable, public UniversityTable: UniversityTable) {
    AccountTable.setSrcClass(this);
    AdressTable.setSrcClass(this);
    UniversityTable.setSrcClass(this);

    this.accID = navParams.get("userId");
    // Abfrage der lokal gespeicherten 'user_id'
      this.loadData();
  }


  onComplete(src, json) {

    if(!json){
      return;
    }

    //Auslesen der Daten aus Tabelle Student where AccID = AccID
    if (src == "uni-abfrage") {
        var body = json.body;
        
        document.getElementById("uni").innerText = body.Universität;
        document.getElementById("branches").innerText = body.Fachrichtungen;
      }

      //Auslesen der Daten aus Tabelle Account
      if(src == "account-abfrage") {
        console.log("Started account abfrage in uni_profile");
        var body = json.body;
        var adresse_id = body.Adresse_id;
     
        //Verschachtelte Abfrage Account mit Adresse
        this.AdressTable.getById(adresse_id, "adresse-abfrage", this.onComplete);
      }
  
      //Auslesen der Daten aus Tabelle Adresse
      if(src == "adresse-abfrage"){
        var body = json.body;
        var adresse = body.Straße + ', ' + body.PLZ + ', ' + body.Land;
        document.getElementById("address").innerText = adresse;
      }
    }

  loadData(){
    this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
    this.UniversityTable.getByValue("Account_Id", this.accID, "uni-abfrage", this.onComplete);
  }
}