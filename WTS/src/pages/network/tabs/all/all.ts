import { Component } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { DataProvider } from '../DataProvider';
import { Varier } from '../../../../providers/varier';
import { AccountTable } from '../../../../providers/api/account';
import { OnResultComplete } from '../../../../providers/api/OnResultComplete';
import { App } from 'ionic-angular/components/app/app';
import { StudentProfilePage } from '../../../profile/student/profile';
import { CompanyProfilePage } from '../../../profile/company/profile';
import { UniProfilePage } from '../../../profile/university/profile';
//import { App } from 'ionic-angular';

@Component({
    selector: 'all-tab',
    templateUrl: 'all.html'
})
export class TabsAll implements OnResultComplete {

    result: any[];

    constructor(public navCtrl: NavController, public varier:Varier,  public app:App,  public accountTable:AccountTable) {
        this.accountTable.setSrcClass(this);
        var provider = new DataProvider();
        this.result = provider.getData();
    }

    ngAfterViewInit() {
    }

    loadMore(event: any) {
        console.log("loading..");
    }

    navigateToUserProfile(id:string, gruppe:string){
        if(gruppe == "gruppe_1"){
            this.app.getRootNav().push(StudentProfilePage, { userId: id, isOwn: false });
        }else if(gruppe == "gruppe_2"){
            this.app.getRootNav().push(CompanyProfilePage, { userId: id });
        }else if(gruppe == "gruppe_3"){
            this.app.getRootNav().push(UniProfilePage, { userId: id });
        }       
    }

    onComplete(source, json){

    }
}