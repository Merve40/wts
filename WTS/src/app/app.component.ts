import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { Profile_externPage } from '../pages/profile_extern/profile_extern';
import { Profile_EditPage } from '../pages/profile_edit/profile_edit';
import { UniProfilePage } from '../pages/uni_profile/uni_profile';
import { CompanyProfilePage } from '../pages/company_profile/company_profile';
import { ListSearchPage } from '../pages/list_search/list_search';
import { MapPage } from '../pages/map/map';
import { MessagePage } from '../pages/message/message_item/message_item';
import { MessageListPage } from '../pages/message/message_list/message_list';

import { TranslateService } from '@ngx-translate/core';

// import firebase from 'firebase';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public storage: Storage, public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, public screenOrientation: ScreenOrientation,
    public translate: TranslateService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    // Labels & Pages in navigationbar in upper left corner

    translate.get(['LOGINPAGE', 'PROFILEPAGE', 'LOGOUT', 'LISTSEARCHPAGE', 'MAPPAGE']).subscribe(translations => {
      this.pages = [
        { title: translations.LOGINPAGE, component: LoginPage },
        { title: translations.PROFILEPAGE, component: ProfilePage },
        { title: translations.LOGOUT, component: LoginPage },
        { title: translations.LISTSEARCHPAGE, component: ListSearchPage },
        { title: translations.MAPPAGE, component: MapPage },        
        { title: 'Extern Profile', component: Profile_externPage },
        { title: 'Edit Profile', component: Profile_EditPage },
        { title: 'Uni Profil', component: UniProfilePage },
        { title: "Message", component: MessagePage },
        { title: "Messages", component: MessageListPage },
        { title: 'Company Profil', component: CompanyProfilePage }
      ];
    })

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //var orient = this.screenOrientation.ORIENTATIONS.PORTRAIT;
      //ionViewWillUnload(this.orient);
      //console.log(this.screenOrientation.lock(orient));
      //console.log(this.screenOrientation.type);

      // var orient = this.screenOrientation.ORIENTATIONS.PORTRAIT;
      // this.screenOrientation.lock(orient);

    });
    // firebase.initializeApp({
    //   apiKey: "AIzaSyATDKANyR1HnCajqaAXINVS0z6kfCBwRwI",
    //   authDomain: "worktostudents.firebaseapp.com",
    //   databaseURL: "https://worktostudents.firebaseio.com",
    //   projectId: "worktostudents",
    //   storageBucket: "worktostudents.appspot.com",
    //   messagingSenderId: "542302693567"
    // });


  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  //   ionViewWillUnload(orientation:any){
  //        this.screenOrientation.lock(orientation);

  //     setTimeout(function() {
  //         this.screenOrientation.unlock();    
  //     }, 300);        
  //   }
}
