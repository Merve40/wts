import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { DataProvider} from '../../../../providers/DataProvider';

@Component({
    selector: 'all-tab',
    templateUrl: 'all.html'
})
export class TabsAll{

    
    users = [];
    
        constructor(public dataProvider: DataProvider) {
        this.users = dataProvider.getStudents();
        }
}