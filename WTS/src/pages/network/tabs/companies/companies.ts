import { Component, ViewChild } from '@angular/core';
import { NavController } from "ionic-angular/navigation/nav-controller";
import { DataProvider } from "../DataProvider";


@Component({
    selector: 'company-tab',
    templateUrl: 'companies.html'
})
export class CompanyNetwork {

    result: any[];

    constructor(public navCtrl: NavController) {
        var provider = new DataProvider();
        this.result = provider.getData();
    }

    ngAfterViewInit() {
    }

    loadMore(event: any) {
        console.log("loading..");
    }
}