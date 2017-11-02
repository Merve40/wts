import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
// import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { Profile_externPage } from '../pages/profile_extern/profile_extern';
import { Profile_EditPage } from '../pages/profile_edit/profile_edit';
import { ListSearchPage } from '../pages/list_search/list_search';

import { Api } from '../providers/api/api';
import { AccountTable } from '../providers/api/account';
import { AdressTable } from '../providers/api/adress';
import { StudentTable } from '../providers/api/student';
import { Student_SkillTable } from '../providers/api/student_skill';
import { SkillTable } from '../providers/api/skill';
import { Student_PassionTable } from '../providers/api/student_passion';
import { PassionTable} from '../providers/api/passion';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MockProvider} from '../pages/list_search/dataprovider';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ProfilePage,
    Profile_externPage,
    Profile_EditPage,
    ListSearchPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
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
    Profile_externPage,
    Profile_EditPage,
    ListSearchPage
  ],
  providers: [
    Api,
    AccountTable,
    AdressTable,
    StudentTable,
    Student_PassionTable,
    Student_SkillTable,
    PassionTable,
    SkillTable,
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    MockProvider,
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


