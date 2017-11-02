import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccountTable } from '../../providers/api/account';
import { AdressTable } from '../../providers/api/adress';
import {UniversityTable} from '../../providers/api/university';
import { OnResultComplete } from '../../providers/api/OnResultComplete';

@Component({
  selector: 'page-uni_profile',
  templateUrl: 'uni_profile.html'
})
export class UniProfilePage implements OnResultComplete {

  AccID = 'acc_30';
  unijson: any;

  constructor(public storage:Storage, public navCtrl: NavController, public AdressTable:AdressTable, 
    public AccountTable: AccountTable, public UniversityTable: UniversityTable) {
    AccountTable.setSrcClass(this);
    AdressTable.setSrcClass(this);
    UniversityTable.setSrcClass(this);
    // Abfrage der lokal gespeicherten 'user_id'
      this.loadData();
  }


  onComplete(src, json) {

    //Auslesen der Daten aus Tabelle Student where AccID = AccID
    if (src == "uni-abfrage") {
        // this.unijson = json;
        // document.getElementById("uni").innerText = this.unijson.body.Universität;
        // document.getElementById("studyProgram").innerText = this.unijson.body.Fachrichtungen;

        var id = json.id;
        var body = json.body;

        document.getElementById("uni").innerText = body.Universität;
        document.getElementById("branches").innerText = body.Fachrichtungen;
      }

      //Auslesen der Daten aus Tabelle Account
      if(src == "account-abfrage") {
          console.log("Started account abfrage");
        var body = json.body;
        var adresse_id = body.Adresse_id;
        console.log("Adresse id: " + adresse_id);
    
        //Verschachtelte Abfrage Account mit Adresse
        this.AdressTable.getById(adresse_id, "adresse-abfrage", this.onComplete);
      }
  
      //Auslesen der Daten aus Tabelle Adresse
      if(src == "adresse-abfrage"){
        console.log("Started adresse abfrage");
        var body = json.body;
        var adresse = body.Straße + ', ' + body.PLZ + ', ' + body.Land;
        console.log("Adresse: "+ adresse);
        document.getElementById("address").innerText = adresse;
      }
    }

  loadData(){
    this.AccountTable.getById(this.AccID, "account-abfrage", this.onComplete);
    this.UniversityTable.getByValue("Account_Id", this.AccID, "uni-abfrage", this.onComplete);
  }

  ngAfterViewInit() {
  }
}