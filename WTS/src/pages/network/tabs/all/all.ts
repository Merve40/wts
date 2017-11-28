import { Component } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { DataProvider } from '../DataProvider';
import { Varier } from '../../../../providers/varier';
import { AccountTable } from '../../../../providers/api/account';
import { OnResultComplete } from '../../../../providers/api/OnResultComplete';

@Component({
    selector: 'all-tab',
    templateUrl: 'all.html'
})
export class TabsAll implements OnResultComplete {

    result: any[];

    constructor(public navCtrl: NavController, public varier:Varier, public accountTable:AccountTable) {
        this.accountTable.setSrcClass(this);
        var provider = new DataProvider();
        this.result = provider.getData();
    }

    ngAfterViewInit() {
    }

    loadMore(event: any) {
        console.log("loading..");
    }

    navigateToUserProfile(id:string){
        this.accountTable.getById(id, "account-abfrage", this.onComplete);
    }

    onComplete(source, json){

        if(json && json.body){
            this.varier.navigateToUserProfile(json);
        }

    }
}