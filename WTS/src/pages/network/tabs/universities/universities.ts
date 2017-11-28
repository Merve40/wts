import { Component } from "@angular/core/src/metadata/directives";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { DataProvider } from "../DataProvider";

@Component({
    selector: 'university-tab',
    templateUrl: 'universities.html'
})
export class UniversityNetwork {
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