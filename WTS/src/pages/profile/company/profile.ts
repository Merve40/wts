import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccountTable } from '../../../providers/api/account';
import { AdressTable } from '../../../providers/api/adress';
import { CompanyTable } from '../../../providers/api/company';
import { OnResultComplete } from '../../../providers/api/OnResultComplete';

@Component({
  selector: 'page-company_profile',
  templateUrl: 'profile.html'
})
export class CompanyProfilePage implements OnResultComplete {

  AccID: string;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public AdressTable: AdressTable,
    public AccountTable: AccountTable, public CompanyTable: CompanyTable) {
    AccountTable.setSrcClass(this);
    AdressTable.setSrcClass(this);
    CompanyTable.setSrcClass(this);
    this.AccID = navParams.get("userId");
    // Abfrage der lokal gespeicherten 'user_id'
    this.loadData();
  }


  onComplete(src, json) {

    if(!json){
      return;
    }

    //Auslesen der Daten aus Tabelle Student where AccID = AccID
    if (src == "company-abfrage") {
      var body = json.body;

      document.getElementById("company").innerText = body.Unternehmen;
      document.getElementById("branches").innerText = body.Branche;
      document.getElementById("link").innerText = body.Webseite;
    }

    //Auslesen der Daten aus Tabelle Account
    if (src == "account-abfrage") {
      var body = json.body;
      var adresse_id = body.Adresse_id;

      //Verschachtelte Abfrage Account mit Adresse
      this.AdressTable.getById(adresse_id, "adresse-abfrage", this.onComplete);
    }

    //Auslesen der Daten aus Tabelle Adresse
    if (src == "adresse-abfrage") {
      var body = json.body;
      var adresse = body.Straße + ', ' + body.PLZ + ', ' + body.Land;
      document.getElementById("address").innerText = adresse;
    }
  }

  loadData() {
    this.CompanyTable.getByValue("Account_Id", this.AccID, "company-abfrage", this.onComplete);
    this.AccountTable.getById(this.AccID, "account-abfrage", this.onComplete);
  }
}