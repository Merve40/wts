import { Component } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { App } from 'ionic-angular/components/app/app';
import { StudentProfilePage } from '../../../profile/student/profile';
import { CompanyProfilePage } from '../../../profile/company/profile';
import { UniProfilePage } from '../../../profile/university/profile';
import { DataProvider } from '../../../../providers/DataProvider';
import { Events } from 'ionic-angular/util/events';
import { ContactRequestTable } from '../../../../providers/api/contactrequest';
import { AccountTable } from '../../../../providers/api/account';

@Component({
    selector: 'all-tab',
    templateUrl: 'all.html'
})
export class TabsAll {

    users = [];

    constructor(public dataProvider: DataProvider, public app: App, public events:Events, 
        public contactTable:ContactRequestTable, public accountTable:AccountTable ) {
        console.log("1");
        // this.contactTable.setSrcClass(this);
        // this.accountTable.setSrcClass(this);
        this.users = dataProvider.getUser();

        events.subscribe("user-added", contactId =>{
            // this.users = dataProvider.getUser();
            // contactTable.getById(contactId, "", (src, json)=>{
            //     var sender = json.body.sender;
            //     accountTable.getById(sender, "", (flag, _json)=>{

            //     });
            // });
        });
    }

    /**
     * Navigates to a User Profile, depending on the usergroup.
     * 
     * @param id account id of the user
     * @param gruppe usergroup -> gruppe_1 (student), gruppe_2 (company), gruppe_3 (university)
     */
    navigateToUserProfile(id: string, group: string) {
        if (group == "group_1") {
            this.app.getRootNav().push(StudentProfilePage, { userId: id, isOwn: false, hasContact: true });
        } else if (group == "group_2") {
            this.app.getRootNav().push(CompanyProfilePage, { userId: id });
        } else if (group == "group_3") {
            this.app.getRootNav().push(UniProfilePage, { userId: id });
        }
    }

    loadMore(event){
        
    }
}