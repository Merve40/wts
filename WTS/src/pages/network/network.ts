import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';

import { TabsAll } from './tabs/all/all';
import { SuperTabs, SuperTabsController, SuperTab } from 'ionic2-super-tabs';
import { Tabs } from 'ionic-angular/components/tabs/tabs';
import { Tab } from 'ionic-angular/navigation/nav-interfaces';

@Component({
    selector: 'page-network',
    templateUrl: 'network.html'
  })
export class Network{


  @ViewChild(Tabs) tabs: Tabs;
  page: any = TabsAll;

  currentTab:Tab;

  constructor(public navCtrl:NavController, public superTabsCtrl:SuperTabsController){    
  }

  ngAfterViewInit(){
    
  }

  onSelect(ev: any) {
    console.log(ev);
  }

}