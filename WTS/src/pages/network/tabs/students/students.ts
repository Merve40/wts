import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { DataProvider} from '../../../../providers/DataProvider';

@Component({
    selector: 'student-tab',
    templateUrl: 'students.html'
})
export class StudentNetwork {

    students = [];

    constructor(public dataProvider: DataProvider) {
    this.students = dataProvider.getStudents();
    }
}