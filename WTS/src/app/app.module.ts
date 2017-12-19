import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { FCM } from '@ionic-native/fcm';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { Globalization } from '@ionic-native/globalization';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { StudentProfilePage } from '../pages/profile/student/profile';
import { ModalContact } from '../pages/profile/student/modal/modal_contact';
import { UniProfilePage } from '../pages/profile/university/profile';
import { CompanyProfilePage } from '../pages/profile/company/profile';
import { Varier } from '../providers/varier';
import { ContactRequestPage } from '../pages/contact_request/contact_request';
import { Profile_EditPage } from '../pages/profile/edit/profile_edit';
import { ListSearchPage } from '../pages/list_search/list_search';
import { MapPage } from '../pages/map/map';
import { NewsfeedPage } from '../pages/newsfeed/newsfeed';
import { MessagePage } from '../pages/message/message_item/message_item';
import { MessageListPage } from '../pages/message/message_list/message_list';
import { Network } from '../pages/network/network';
import { Settings } from '../pages/settings/settings';
import { SettingsVisibility } from '../pages/settings/settings_visibility/settings_visibility';


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
import { TabsAll } from '../pages/network/tabs/all/all';
import { StudentNetwork } from '../pages/network/tabs/students/students';
import { CompanyNetwork } from '../pages/network/tabs/companies/companies';
import { UniversityNetwork } from '../pages/network/tabs/universities/universities';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { TranslateService } from '@ngx-translate/core';
import { DataProvider } from '../providers/DataProvider';
import { BlockTable } from '../providers/api/block';
import { VisibilityTable } from '../providers/api/visibility';
import { NotificationService } from '../providers/notification_service';
import { EditPinPage } from '../pages/editpin/editpin';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    StudentProfilePage,
    Profile_EditPage,
    ListSearchPage,
    MapPage,
    EditPinPage,
    ContactRequestPage,
    CompanyProfilePage,
    MessagePage,
    MessageListPage,
    UniProfilePage,
    StudentNetwork,
    CompanyNetwork,
    UniversityNetwork,
    Network,
    StudentNetwork,
    UniversityNetwork,
    CompanyNetwork,
    TabsAll,
    Settings,
    SettingsVisibility,
    ModalContact,
    NewsfeedPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    SuperTabsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(),
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
    StudentProfilePage,
    Profile_EditPage,
    ListSearchPage,
    ContactRequestPage,
    MapPage,
    EditPinPage,
    UniProfilePage,
    MessagePage,
    MessageListPage,
    CompanyProfilePage,
    StudentNetwork,
    CompanyNetwork,
    UniversityNetwork,
    Network,
    StudentNetwork,
    UniversityNetwork,
    CompanyNetwork,
    Settings,
    SettingsVisibility,
    TabsAll,
    ModalContact,
    NewsfeedPage
  ],
  providers: [
    Varier,
    Globalization,
    FCM,
    BackgroundMode,
    Api,
    AccountTable,
    AdressTable,
    StudentTable,
    Student_PassionTable,
    Student_SkillTable,
    PassionTable,
    DataProvider,
    SkillTable,
    UniversityTable,
    CompanyTable,
    ContactRequestTable,
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    ConversationTable,
    MessageTable,
    BlockTable,
    VisibilityTable,
    NotificationService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {
  constructor(translate: TranslateService, global: Globalization) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    var sprache;
    global.getPreferredLanguage().then(result => {
      sprache = result.value;
      console.log("NEXUS 10 Device Language is: " + sprache);
    }
    )


    // global.getPreferredLanguage().then(result => switch(result) {
    //   case '{"value":"de-DE"}':
    //     translate.use('de')
    //     break;
    //   case '{"value":"en-US"}':
    //     translate.use('en')
    //     break;
    //   default:
    //     translate.setDefaultLang('en');
    // }


    } 
 }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


