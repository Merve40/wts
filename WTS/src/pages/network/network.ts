import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';

import { TabsAll } from './tabs/all/all';
import { Tabs } from 'ionic-angular/components/tabs/tabs';
import { Tab } from 'ionic-angular/navigation/nav-interfaces';
import { StudentNetwork } from './tabs/students/students';
import { CompanyNetwork } from './tabs/companies/companies';
import { UniversityNetwork } from './tabs/universities/universities';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

/**
 * Page for displaying all contacts within the social network.
 */
@Component({
  selector: 'page-network',
  templateUrl: 'network.html'
})
export class Network {

  @ViewChild(Tabs) tabs: Tabs;

  index:any = 0;

  //each page is corresping to a tab
  page: any = TabsAll;
  pageStudent: any = StudentNetwork;
  pageCompaney: any = CompanyNetwork;
  pageUniversity: any = UniversityNetwork;

  currentTab: Tab;

  constructor(public navCtrl: NavController, public translate: TranslateService) {
  }

  /**
   * This method is triggered, when a tab was clicked.
   * @param ev 
   */
  onSelect(ev: any) {
    console.log(ev);
    this.index = ev.index;
  }

}