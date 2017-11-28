import { Component } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';

@Component({
    selector: 'all-tab',
    templateUrl: 'all.html'
})
export class TabsAll {

    constructor(public navCtrl: NavController) {
        console.log("created page ALL");
    }
}