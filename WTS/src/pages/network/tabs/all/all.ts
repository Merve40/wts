import { Component } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { DataProvider } from '../DataProvider';

@Component({
    selector: 'all-tab',
    templateUrl: 'all.html'
})
export class TabsAll {

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