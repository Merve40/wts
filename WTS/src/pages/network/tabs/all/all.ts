import { Component, NgZone } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { App } from 'ionic-angular/components/app/app';
import { StudentProfilePage } from '../../../profile/student/profile';
import { CompanyProfilePage } from '../../../profile/company/profile';
import { UniProfilePage } from '../../../profile/university/profile';
import { DataProvider, UserGroup } from '../../../../providers/DataProvider';
import { ContactRequestTable } from '../../../../providers/api/contactrequest';
import { AccountTable } from '../../../../providers/api/account';
import { Storage } from '@ionic/storage';
import { NotificationService, NotificationEvent } from '../../../../providers/notification_service';
import { isPageActive } from '../../../../app/app.component';

@Component({
    selector: 'all-tab',
    templateUrl: 'all.html'
})
export class TabsAll {

    users = [];

    constructor(public dataProvider: DataProvider, public app: App, public events: Events, public storage: Storage,
        public contactTable: ContactRequestTable, public accountTable: AccountTable, zone: NgZone,
        public notificationService: NotificationService) {

        console.log("all-tab");
        dataProvider.getUsersByGroup(UserGroup.ALL).then((users) => {
            this.users = users;
            this.subscribe();
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

    subscribe() {
        this.notificationService.subscribe(NotificationEvent.CONTACT_ACCEPTED, (fromServer, data) => {
            if (!isPageActive(TabsAll)) {
                return;
            }
            if (fromServer) {
                this.dataProvider.getNewUser(data.sender, data.timestamp).then(user => {
                    this.users.push(user);
                });
                this.notificationService.notify(NotificationEvent.CONTACT_ACCEPTED, false, data);
            }

        });
    }
}