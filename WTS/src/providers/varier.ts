import { Component, Injectable, Inject } from '@angular/core';
import { App, Nav, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccountTable } from './api/account';
import { OnResultComplete } from './api/OnResultComplete';
import { TranslateService } from '@ngx-translate/core';

import { ProfilePage } from '../pages/profile/profile';
import { CompanyProfilePage } from '../pages/company_profile/company_profile';
import { UniProfilePage } from '../pages/uni_profile/uni_profile';
import { LoginPage } from '../pages/login/login';

/**
 * Service Class for handling Profile-Forwarding
 */
@Injectable()
export class Varier implements OnResultComplete {

    userId: string;
    accID: string;
    isOwn: boolean;
    hasSource: boolean; //true, wenn diese Seite von Search aus aufgerufen wird

    constructor(public storage: Storage, public app:App, public toastCtrl: ToastController,
        public translate: TranslateService, public AccountTable: AccountTable) {
        this.hasSource = false;        
    }

    public forward(hasSource: boolean, userId: string) {
        this.AccountTable.setSrcClass(this);
        this.userId = userId;
        this.hasSource = hasSource;
        this.storage.get("user_id").then((id) => this.load(id));
    }

    load(id) {
        //Checks if navigation was made from side menu.
        //Navigates to own profile
        if (this.userId == undefined) {
            console.log("Profile_Extern: Own profile reached from Menubar");
            this.isOwn = true;
            this.accID = id;
            this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);

            // Navigates to own profile 
        } else if (id == this.userId) {
            console.log("Profile_Extern: Own profile reached from Login");
            this.isOwn = true;
            this.accID = id;
            this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);

            //Navigates to foreign profile
        } else {
            console.log("Profile_Extern: Extern profile reached");
            this.isOwn = false;
            this.accID = this.userId;
            console.log("accID ist jetzt: " + this.accID);
            this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
        }
    }

    onComplete(src, json) {
        if (src == "account-abfrage") {
            var body = json.body;
            var group_id = body.Usergruppe;
            console.log("json.id = " + json.id);
            this.navigateToUserProfile(json);
        }
    }

    navigateToUserProfile(json) {
        console.log("opened navigate to profile in profile_extern");
        switch (json.body.Usergruppe) {
            case "gruppe_1":

                if (!this.hasSource) {
                    // this.navCtrl.setRoot(ProfilePage, { userId: json.id, isOwn: this.isOwn });
                    this.app.getActiveNav().setRoot(ProfilePage, { userId: json.id, isOwn: this.isOwn });
                } else {
                    this.app.getActiveNav().push(ProfilePage, { userId: json.id, isOwn: this.isOwn });
                }
                break;

            case "gruppe_2":

                if (!this.hasSource) {
                    // this.navCtrl.setRoot(CompanyProfilePage, { userId: json.id });
                    this.app.getActiveNav().setRoot(CompanyProfilePage, { userId: json.id });
                } else {
                    this.app.getActiveNav().push(CompanyProfilePage, { userId: json.id });
                }
                break;

            case "gruppe_3":
                if (!this.hasSource) {
                    this.app.getActiveNav().setRoot(UniProfilePage, { userId: json.id });
                } else {
                    this.app.getActiveNav().push(UniProfilePage, { userId: json.id });
                }
                break;

            default:
                console.log("Entered navigation: DB Error");
                this.app.getActiveNav().setRoot(LoginPage, { userId: json.id });
                this.translate.get('DB-ERROR').subscribe(
                    value => {
                        this.showError(value);
                    });
        }
    }

    showError(message) {
        const toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    ngAfterViewInit() {
    }
}