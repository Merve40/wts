import { Component } from '@angular/core';
import { NavController, NavParams, Button, ModalController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccountTable, Account } from '../../../../providers/api/account';

enum UserGroup {
    STUDENT = 'gruppe_1',
    COMPANY = 'gruppe_2',
    UNIVERSITY = 'gruppe_3'
}

@Component({
    selector: 'modal-contact',
    templateUrl: 'modal_contact.html'
})
export class ModalContact {

    message: string; 
    receiver: string;
    invalid:boolean = false;

    constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,
        public view:ViewController, public AccountTable: AccountTable) {

        AccountTable.setSrcClass(this);
        this.receiver = navParams.get('receiver');
    }

    sendRequest() {
        this.storage.get('user_id').then(id => {
            var contactRequest = {
                receiver: this.receiver,
                sender: id,
                request: false,
                message: this.message,
                Zeitstempel: this.AccountTable.TIMESTAMP
            };

            this.getUserAccount(id).then((user) => {
                if (user.Usergruppe == UserGroup.COMPANY && this.message == undefined) {
                    this.invalid = true;
                    // this.dismiss(contactRequest);
                } else {
                    this.dismiss(contactRequest); 
                }
            });
        });
    }

    dismiss(data?:any) {
        console.log("dismissing modal");
        this.view.dismiss(data);
    }

    getUserAccount(id: string): Promise<Account> {
        return new Promise<Account>((resolve, reject) => {
            this.AccountTable.getById(id, "", (src, json) => {
                if (json.body == null) {
                    reject();
                } else {
                    var account = {
                        Adresse_id: json.body.Adresse_id,
                        Email: json.body.Email,
                        Passwort: json.body.Passwort,
                        Token: json.body.Token,
                        Usergruppe: json.body.Usergruppe
                    }
                    resolve(account);
                }
            });
        });
    }
}