import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { DataProvider} from '../../../../providers/DataProvider';

@Component({
    selector: 'university-tab',
    templateUrl: 'universities.html'
})
export class UniversityNetwork {
    
    universities = [];
    
        constructor(public dataProvider: DataProvider) {
        this.universities = dataProvider.getStudents();
        }
}