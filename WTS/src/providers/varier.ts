import { Injectable } from '@angular/core';
import { App, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccountTable } from './api/account';
import { OnResultComplete } from './api/OnResultComplete';
import { TranslateService } from '@ngx-translate/core';

import { StudentProfilePage } from '../pages/profile/student/profile';
import { CompanyProfilePage } from '../pages/profile/company/profile';
import { UniProfilePage } from '../pages/profile/university/profile';
import { LoginPage } from '../pages/login/login';

/**
 * Service Class for handling Profile-Forwarding
 */
@Injectable()
export class Varier implements OnResultComplete {
    
    userId: string;
    accID: string;
    isOwn: boolean;
    hasSource: boolean; //true, if the page was called from Search
    hasContact: boolean; //true, if the user is in contact

    constructor(public storage: Storage, public app:App, public toastCtrl: ToastController,
        public translate: TranslateService, public AccountTable: AccountTable) {
        this.hasSource = false;        
    }

    /**
     * Forwards the user to a profile, regardless of the usergroup.
     * 
     * @param hasSource true if this method is being called from Search-Page
     * @param userId account id of user, might be undefined if called from the menu
     */
    public forward(hasSource: boolean, userId: string) {
        this.AccountTable.setSrcClass(this);
        this.userId = userId;
        this.hasSource = hasSource;
        this.hasContact = false;
        this.storage.get("user_id").then((id) => this.load(id));        
    }

    /**
     * Loads User by it's id.
     * 
     * @param id account id of user 
     */
    load(id) {
        //Checks if navigation was made from side menu.
        //Navigates to own profile
        if (this.userId == undefined) {
            console.log("Profile_Extern: Own profile reached from Menubar");
            this.isOwn = true;
            this.accID = id;
            this.hasContact = true;
            this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
           
            // Navigates to own profile 
        } else if (id == this.userId) {
            console.log("Profile_Extern: Own profile reached from Login");
            this.isOwn = true;
            this.accID = id;
            this.hasContact = true;
            this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);
           
            //Navigates to foreign profile
        } else {
            console.log("Profile_Extern: Extern profile reached");
            this.isOwn = false;
            this.accID = this.userId;
            this.hasContact = false;
            console.log("accID ist jetzt: " + this.accID);
            this.AccountTable.getById(this.accID, "account-abfrage", this.onComplete);           
        }
    }

    /**
     * Processes result from server.
     * 
     * @param src query source
     * @param json data in JSON-Format
     */
    onComplete(src, json) {
        if (src == "account-abfrage") {
            var body = json.body;
            console.log("json.id = " + json.id);
            this.navigateToUserProfile(json);
        }
    }

    /**
     * Navigates to specific Usr Profile -> Student, Company or university.
     * 
     * @param json data in JSON-Format 
     */
    navigateToUserProfile(json) {
        console.log("opened navigate to profile in profile_extern");
        switch (json.body.Usergruppe) {
            case "gruppe_1":

                if (!this.hasSource) {
                    this.app.getRootNav().setRoot(StudentProfilePage, { userId: json.id, isOwn: this.isOwn , hasContact: this.hasContact});
                } else {
                    this.app.getRootNav().push(StudentProfilePage, { userId: json.id, isOwn: this.isOwn, hasContact: this.hasContact });
                }
                break;

            case "gruppe_2":

                if (!this.hasSource) {
                    this.app.getRootNav().setRoot(CompanyProfilePage, { userId: json.id });
                } else {
                    this.app.getRootNav().push(CompanyProfilePage, { userId: json.id });
                }
                break;

            case "gruppe_3":
                if (!this.hasSource) {
                    this.app.getRootNav().setRoot(UniProfilePage, { userId: json.id });
                } else {
                    this.app.getRootNav().push(UniProfilePage, { userId: json.id });
                }
                break;

            default: // throw error if usergroup is undefined
                console.log("Entered navigation: DB Error");
                this.app.getRootNav().setRoot(LoginPage, { userId: json.id });
                this.translate.get('DB-ERROR').subscribe(
                    value => {
                        this.showError(value);
                    });
        }
    }

    /**
     * Displays a message.
     * 
     * @param message 
     */
    showError(message) {
        const toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
}