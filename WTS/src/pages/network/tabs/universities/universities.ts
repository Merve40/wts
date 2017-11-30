import { Component, ViewChild } from '@angular/core';
import { App } from 'ionic-angular/components/app/app';
import { UniProfilePage } from '../../../profile/university/profile';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { DataProvider } from '../../../../providers/DataProvider';

@Component({
    selector: 'university-tab',
    templateUrl: 'universities.html'
})
export class UniversityNetwork {

    universities = [];

    constructor(public dataProvider: DataProvider, public app: App) {
        this.universities = dataProvider.getStudents();
    }

    navigateToUserProfile(id: string) {
        this.app.getRootNav().push(UniProfilePage, { userId: id });
    }

    loadMore(event: any) {
        console.log("loading..");
    }
}