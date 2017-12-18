import { Component } from '@angular/core';
import { App } from 'ionic-angular/components/app/app';
import { CompanyProfilePage } from '../../../profile/company/profile';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { DataProvider, UserGroup } from '../../../../providers/DataProvider';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage/es2015/storage';
import { NotificationService, NotificationEvent } from '../../../../providers/notification_service';
import { isPageActive } from '../../../../app/app.component';


@Component({
    selector: 'company-tab',
    templateUrl: 'companies.html'
})
export class CompanyNetwork {

    companies = [];

    constructor(public dataProvider: DataProvider, public app: App, public events: Events, public storage: Storage,
        public notificationService: NotificationService) {

        console.log("company-tab");
        dataProvider.getUsersByGroup(UserGroup.COMPANY).then((users) => {
            this.companies = users;
            this.subscribe();
        });

    }

    /**
     * Navigates to the profile of the company
     * @param id account id
     */
    navigateToUserProfile(id: string) {
        this.app.getRootNav().push(CompanyProfilePage, { userId: id });
    }

    loadMore(event) {
    }

    subscribe() {
        this.notificationService.subscribe(NotificationEvent.CONTACT_ACCEPTED, (fromServer, data) => {
            if (!isPageActive(CompanyNetwork)) {
                return;
            }
            if (fromServer) {
                this.dataProvider.getNewUser(data.sender, data.timestamp).then(user => {
                    this.companies.push(user);
                });
                this.notificationService.notify(NotificationEvent.CONTACT_ACCEPTED, false, data);
            }

        });
    }
}
