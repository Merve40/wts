import { Component } from '@angular/core';
import { App } from 'ionic-angular/components/app/app';
import { StudentProfilePage } from '../../../profile/student/profile';
import { DataProvider, UserGroup } from '../../../../providers/DataProvider';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NotificationService, NotificationEvent } from '../../../../providers/notification_service';
import { isPageActive } from '../../../../app/app.component';


@Component({
    selector: 'student-tab',
    templateUrl: 'students.html'
})
export class StudentNetwork {

    students = [];

    constructor(public dataProvider: DataProvider, public app: App, public events:Events, public storage:Storage, 
        public notificationService:NotificationService) {
        console.log("student-tab");
        dataProvider.getUsersByGroup(UserGroup.STUDENT).then((users)=>{
            this.students = users;
            this.subscribe();
        });
    }

    /**
     * Navigates to the profile of the student
     * @param id account id
     */
    navigateToUserProfile(id: string) {
        this.app.getRootNav().push(StudentProfilePage, { userId: id });
    }

    subscribe() {
        this.notificationService.subscribe(NotificationEvent.CONTACT_ACCEPTED, (fromServer, data) => {
            if (!isPageActive(StudentNetwork)) {
                return;
            }
            if (fromServer) {
                this.dataProvider.getNewUser(data.sender, data.timestamp).then(user => {
                    this.students.push(user);
                });
                this.notificationService.notify(NotificationEvent.CONTACT_ACCEPTED, false, data);
            }
        });
    }
}