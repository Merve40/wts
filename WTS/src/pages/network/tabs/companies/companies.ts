import { Component } from '@angular/core';
import { App } from 'ionic-angular/components/app/app';
import { CompanyProfilePage } from '../../../profile/company/profile';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { DataProvider } from '../../../../providers/DataProvider';
import { Events } from 'ionic-angular';


@Component({
    selector: 'company-tab',
    templateUrl: 'companies.html'
})
export class CompanyNetwork {

    companies = [];

    constructor(public dataProvider: DataProvider, public app: App, public events:Events) {
        this.companies = dataProvider.getCompanies();

        events.subscribe("contact-added", senderId =>{
            dataProvider.getNewUser(senderId).then((user)=>{
                if(user.usergroup == "group_2"){
                    this.companies.push();
                }                
            });            
        });
    }

    /**
     * Navigates to the profile of the company
     * @param id account id
     */
    navigateToUserProfile(id: string) {
        this.app.getRootNav().push(CompanyProfilePage, { userId: id });
    }

    loadMore(event){
        
    }
}
