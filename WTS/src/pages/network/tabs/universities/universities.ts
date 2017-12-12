import { Component, ViewChild } from '@angular/core';
import { App } from 'ionic-angular/components/app/app';
import { UniProfilePage } from '../../../profile/university/profile';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { DataProvider, UserGroup } from '../../../../providers/DataProvider';
import { Events } from 'ionic-angular';

@Component({
    selector: 'university-tab',
    templateUrl: 'universities.html'
})
export class UniversityNetwork {

    universities = [];

    constructor(public dataProvider: DataProvider, public app: App, public events:Events) {
        console.log("uni-tab");
        dataProvider.getUsersByGroup(UserGroup.UNIVERSITY).then((users)=>{
            this.universities = users;
        });

        events.subscribe("contact-accepted", senderId =>{
            dataProvider.getNewUser(senderId).then((user)=>{
                if(user.usergroup == "group_3"){
                    this.universities.push();
                }                
            });            
        });
    }

    /**
     * Navigates to the profile of the university
     * @param id account id
     */
    navigateToUserProfile(id: string) {
        this.app.getRootNav().push(UniProfilePage, { userId: id });
    }

    loadMore(event){
        
    }
}