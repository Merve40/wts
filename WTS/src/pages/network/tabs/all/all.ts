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
        this.users = dataProvider.getStudents();
    }

    loadMore(event: any) {
        console.log("loading..");
    }

    navigateToUserProfile(id: string, gruppe: string) {
        if (gruppe == "gruppe_1") {
            this.app.getRootNav().push(StudentProfilePage, { userId: id, isOwn: false, hasContact: true });
        } else if (gruppe == "gruppe_2") {
            this.app.getRootNav().push(CompanyProfilePage, { userId: id });
        } else if (gruppe == "gruppe_3") {
            this.app.getRootNav().push(UniProfilePage, { userId: id });
        }
    }
}