import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { HttpModule, Http } from '@angular/http';
import { FCM } from '@ionic-native/fcm';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { UniProfilePage } from '../pages/uni_profile/uni_profile';
import { CompanyProfilePage } from '../pages/company_profile/company_profile';
import { Varier } from '../providers/varier';
import { ContactRequestPage } from '../pages/Contact_request/contact_request';
import { Profile_EditPage } from '../pages/profile_edit/profile_edit';
import { ListSearchPage } from '../pages/list_search/list_search';
import { MapPage } from '../pages/map/map';
import { MessagePage } from '../pages/message/message_item/message_item';
import { MessageListPage } from '../pages/message/message_list/message_list';

import { Api } from '../providers/api/api';
import { AccountTable } from '../providers/api/account';
import { AdressTable } from '../providers/api/adress';
import { StudentTable } from '../providers/api/student';
import { Student_SkillTable } from '../providers/api/student_skill';
import { SkillTable } from '../providers/api/skill';
import { Student_PassionTable } from '../providers/api/student_passion';
import { PassionTable } from '../providers/api/passion';
import { UniversityTable } from '../providers/api/university';
import { CompanyTable } from '../providers/api/company';
import { ConversationTable } from '../providers/api/conversation';
import { MessageTable } from '../providers/api/message';
import { ContactRequestTable } from '../providers/api/contactrequest';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from '../pages/list_search/dataprovider';
import { NavController } from 'ionic-angular/navigation/nav-controller';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ProfilePage,
    Profile_EditPage,
    ListSearchPage,
    MapPage,
    ContactRequestPage,
    CompanyProfilePage,
    MessagePage,
    MessageListPage,
    UniProfilePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    ProfilePage,
    Profile_EditPage,
    ListSearchPage,
    ContactRequestPage,
    MapPage,
    UniProfilePage,
    MessagePage,
    MessageListPage,
    CompanyProfilePage
  ],
  providers: [
    Varier,
    FCM,
    BackgroundMode,
    Api,
    AccountTable,
    AdressTable,
    StudentTable,
    Student_PassionTable,
    Student_SkillTable,
    PassionTable,
    SkillTable,
    UniversityTable,
    CompanyTable,
    ContactRequestTable,
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    MockProvider,
    ConversationTable,
    MessageTable,
    // Storage,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {
  constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('de');
  }
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


