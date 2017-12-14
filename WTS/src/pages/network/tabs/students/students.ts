import { Component } from '@angular/core';
import { App } from 'ionic-angular/components/app/app';
import { StudentProfilePage } from '../../../profile/student/profile';
import { DataProvider, UserGroup } from '../../../../providers/DataProvider';
import { Events } from 'ionic-angular';

@Component({
    selector: 'student-tab',
    templateUrl: 'students.html'
})
export class StudentNetwork {

    students = [];

    constructor(public dataProvider: DataProvider, public app: App, public events:Events) {
        console.log("student-tab");
        dataProvider.getUsersByGroup(UserGroup.STUDENT).then((users)=>{
            this.students = users;
        });

        events.subscribe("contact-accepted", data =>{
            dataProvider.getNewUser(data.senderId, data.timestamp).then((user)=>{
                if(user.usergroup == "group_1"){
                    this.students.push();
                }                
            });            
        });
    }

    /**
     * Navigates to the profile of the student
     * @param id account id
     */
    navigateToUserProfile(id: string) {
        this.app.getRootNav().push(StudentProfilePage, { userId: id });
    }

    loadMore(event){
        
    }
}