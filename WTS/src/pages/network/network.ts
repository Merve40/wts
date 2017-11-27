import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';

import { TabsAll } from './tabs/all/all';
import { SuperTabs, SuperTabsController, SuperTab } from 'ionic2-super-tabs';

@Component({
    selector: 'page-network',
    templateUrl: 'network.html'
  })
export class Network{

  @ViewChild(SuperTabs) superTabs: SuperTabs;
  page: any = TabsAll;

  currentTab:SuperTab;

  constructor(public navCtrl:NavController, public superTabsCtrl:SuperTabsController){    
  }

  ngAfterViewInit(){
    this.superTabsCtrl.enableTabsSwipe(true);    
    this.currentTab = this.superTabs.getActiveTab();
    this.currentTab.color = "light";
  }

  slideToIndex(index: number) {
    console.log("sliding..");
    this.superTabs.slideTo(index);
  }

  onTabSelect(ev: any) {
    console.log('Tab selected', 'Index: ' + ev.index, 'Unique ID: ' + ev.id);
  }

}