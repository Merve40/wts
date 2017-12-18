import { Component, ViewChild } from '@angular/core';
import { App } from 'ionic-angular/components/app/app';
import { UniProfilePage } from '../../../profile/university/profile';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { DataProvider, UserGroup } from '../../../../providers/DataProvider';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NotificationService, NotificationEvent } from '../../../../providers/notification_service';
import { isPageActive } from '../../../../app/app.component';

@Component({
    selector: 'university-tab',
    templateUrl: 'universities.html'
})
export class UniversityNetwork {

    universities = [];

    constructor(public dataProvider: DataProvider, public app: App, public events:Events, public storage:Storage,
                public notificationService:NotificationService) {
       
                    console.log("uni-tab");
        dataProvider.getUsersByGroup(UserGroup.UNIVERSITY).then((users)=>{
            this.universities = users;
            this.subscribe();
        });
    }

    /**
     * Navigates to the profile of the university
     * @param id account id
     */
    navigateToUserProfile(id: string) {
        this.app.getRootNav().push(UniProfilePage, { userId: id });
    }

    loadMore(event){
    }

    subscribe() {
        this.notificationService.subscribe(NotificationEvent.CONTACT_ACCEPTED, (fromServer, data) => {
            if (!isPageActive(UniversityNetwork)) {
                return;
            }
            if (fromServer) {
                this.dataProvider.getNewUser(data.sender, data.timestamp).then(user => {
                    this.universities.push(user);
                });
                this.notificationService.notify(NotificationEvent.CONTACT_ACCEPTED, false, data);
            }

        });
    }
}