import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { DataProvider} from '../../../../providers/DataProvider';


@Component({
    selector: 'company-tab',
    templateUrl: 'companies.html'
})
export class CompanyNetwork{
    
        companies = [];
    
        constructor(public dataProvider: DataProvider) {
        this.companies = dataProvider.getStudents();
        }
    }