import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccountTable } from '../../providers/api/account';
import { AdressTable } from '../../providers/api/adress';
import { CompanyTable } from '../../providers/api/company';
import { OnResultComplete } from '../../providers/api/OnResultComplete';

@Component({
  selector: 'page-company_profile',
  templateUrl: 'company_profile.html'
})
export class CompanyProfilePage implements OnResultComplete {

  AccID = 'acc_11';
  
  constructor(public storage:Storage, public navCtrl: NavController, public AdressTable:AdressTable, 
    public AccountTable: AccountTable, public CompanyTable: CompanyTable) {
    AccountTable.setSrcClass(this);
    AdressTable.setSrcClass(this);
    CompanyTable.setSrcClass(this);
    // Abfrage der lokal gespeicherten 'user_id'
      this.loadData();
  }


  onComplete(src, json) {

    console.log(json.body);

    //Auslesen der Daten aus Tabelle Student where AccID = AccID
    if (src == "company-abfrage") {
        console.log("Started company abfrage");

        var id = json.id;
        var body = json.body;

        document.getElementById("company").innerText = body.Unternehmen;
        document.getElementById("branches").innerText = body.Branche;
        document.getElementById("link").innerText = body.Webseite;
        console.log("Ended company abfrage");
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
    this.CompanyTable.getByValue("Account_id", this.AccID, "company-abfrage", this.onComplete);
    this.AccountTable.getById(this.AccID, "account-abfrage", this.onComplete);    
  }

  ngAfterViewInit() {
  }
}