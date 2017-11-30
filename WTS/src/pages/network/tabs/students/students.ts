import { Component } from '@angular/core';
import { App } from 'ionic-angular/components/app/app';
import { StudentProfilePage } from '../../../profile/student/profile';
import { DataProvider } from '../../../../providers/DataProvider';

@Component({
    selector: 'student-tab',
    templateUrl: 'students.html'
})
export class StudentNetwork {

    students = [];

    constructor(public dataProvider: DataProvider, public app: App) {
        console.log("start");
        dataProvider.getUser().forEach(element => {
            console.log("checkelements");
            if (element.usergroup == "group_1")
                this.students.push(element);
        });
    }

    /**
     * Navigates to the profile of the student
     * @param id account id
     */
    navigateToUserProfile(id: string) {
        this.app.getRootNav().push(StudentProfilePage, { userId: id });
    }
}