import { Component, ViewChild } from '@angular/core';
import { NavController } from "ionic-angular/navigation/nav-controller";
import { DataProvider } from "../DataProvider";
import { App } from 'ionic-angular/components/app/app';
import { CompanyProfilePage } from '../../../profile/company/profile';


@Component({
    selector: 'company-tab',
    templateUrl: 'companies.html'
})
export class CompanyNetwork {

    result: any[];

    constructor(public navCtrl: NavController, public app:App) {
        var provider = new DataProvider();
        this.result = provider.getData();
    }

    navigateToUserProfile(id:string){
        this.app.getRootNav().push(CompanyProfilePage, { userId: id});
    }

    ngAfterViewInit() {
    }

    loadMore(event: any) {
        console.log("loading..");
    }
}