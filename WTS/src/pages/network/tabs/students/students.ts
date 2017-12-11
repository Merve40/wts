import { Component } from '@angular/core';
import { App } from 'ionic-angular/components/app/app';
import { StudentProfilePage } from '../../../profile/student/profile';
import { DataProvider } from '../../../../providers/DataProvider';
import { Events } from 'ionic-angular';

@Component({
    selector: 'student-tab',
    templateUrl: 'students.html'
})
export class StudentNetwork {

    students = [];

    constructor(public dataProvider: DataProvider, public app: App, public events:Events) {
        console.log("start");
        this.students = dataProvider.getStudents();

        events.subscribe("contact-added", senderId =>{
            dataProvider.getNewUser(senderId).then((user)=>{
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