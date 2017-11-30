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
        this.students = dataProvider.getStudents();
    }

    /**
     * Navigates to the profile of the student
     * @param id account id
     */
    navigateToUserProfile(id: string) {
        this.app.getRootNav().push(StudentProfilePage, { userId: id });
    }

    loadMore(event: any) {
        console.log("loading..");
    }
}