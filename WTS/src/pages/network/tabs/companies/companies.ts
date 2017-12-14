import { Component } from '@angular/core';
import { App } from 'ionic-angular/components/app/app';
import { CompanyProfilePage } from '../../../profile/company/profile';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { DataProvider, UserGroup } from '../../../../providers/DataProvider';
import { Events } from 'ionic-angular';


@Component({
    selector: 'company-tab',
    templateUrl: 'companies.html'
})
export class CompanyNetwork {

    companies = [];

    constructor(public dataProvider: DataProvider, public app: App, public events:Events) {
        console.log("company-tab");
        dataProvider.getUsersByGroup(UserGroup.COMPANY).then((users)=>{
            this.companies = users;
        });

        events.subscribe("contact-accepted", data =>{
            dataProvider.getNewUser(data.senderId, data.timestamp).then((user)=>{
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
