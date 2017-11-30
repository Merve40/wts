import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';

import { TabsAll } from './tabs/all/all';
import { Tabs } from 'ionic-angular/components/tabs/tabs';
import { Tab } from 'ionic-angular/navigation/nav-interfaces';
import { StudentNetwork } from './tabs/students/students';
import { CompanyNetwork } from './tabs/companies/companies';
import { UniversityNetwork } from './tabs/universities/universities';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
    selector: 'page-network',
    templateUrl: 'network.html'
  })
export class Network{

  @ViewChild(Tabs) tabs: Tabs;

  page: any = TabsAll;
  pageStudent:any = StudentNetwork;
  pageCompaney:any = CompanyNetwork;
  pageUniversity:any = UniversityNetwork;

  currentTab:Tab;

  constructor(public navCtrl:NavController,  public translate: TranslateService){    
  }

  ngAfterViewInit(){
  }

  onSelect(ev: any) {
    console.log(ev);
  }

}