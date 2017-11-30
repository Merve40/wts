import { Component } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { App } from 'ionic-angular/components/app/app';
import { StudentProfilePage } from '../../../profile/student/profile';
import { CompanyProfilePage } from '../../../profile/company/profile';
import { UniProfilePage } from '../../../profile/university/profile';
import { DataProvider } from '../../../../providers/DataProvider';

@Component({
    selector: 'all-tab',
    templateUrl: 'all.html'
})
export class TabsAll {

    users = [];

    constructor(public dataProvider: DataProvider, public app: App, ) {
        console.log("1");
        this.users = dataProvider.getUser();
    }

    navigateToUserProfile(id: string, group: string) {
        if (group == "group_1") {
            this.app.getRootNav().push(StudentProfilePage, { userId: id, isOwn: false, hasContact: true });
        } else if (group == "group_2") {
            this.app.getRootNav().push(CompanyProfilePage, { userId: id });
        } else if (group == "group_3") {
            this.app.getRootNav().push(UniProfilePage, { userId: id });
        }
    }
}