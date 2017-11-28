import { Component, ViewChild } from '@angular/core';
import { NavController } from "ionic-angular/navigation/nav-controller";
import { DataProvider } from "../DataProvider";
import { App } from 'ionic-angular/components/app/app';
import { UniProfilePage } from '../../../profile/university/profile';

@Component({
    selector: 'university-tab',
    templateUrl: 'universities.html'
})
export class UniversityNetwork {
    result: any[];

    constructor(public navCtrl: NavController, public app:App) {
        var provider = new DataProvider();
        this.result = provider.getData();
    }

    ngAfterViewInit() {
    }

    navigateToUserProfile(id:string){
        this.app.getRootNav().push(UniProfilePage, { userId: id});
    }

    loadMore(event: any) {
        console.log("loading..");
    }
}