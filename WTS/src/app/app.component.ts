import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { FCM } from '@ionic-native/fcm';
import { BackgroundMode } from '@ionic-native/background-mode';

import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { Varier } from '../providers/varier';
import { Profile_EditPage } from '../pages/profile_edit/profile_edit';
import { UniProfilePage } from '../pages/uni_profile/uni_profile';
import { ContactRequestPage } from '../pages/Contact_request/contact_request';
import { CompanyProfilePage } from '../pages/company_profile/company_profile';
import { ListSearchPage } from '../pages/list_search/list_search';
import { MapPage } from '../pages/map/map';
import { MessagePage } from '../pages/message/message_item/message_item';
import { MessageListPage } from '../pages/message/message_list/message_list';
import { AccountTable } from '../providers/api/account';

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

  constructor(public varier:Varier, public storage: Storage, public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, public screenOrientation: ScreenOrientation,
    public translate: TranslateService, public fcm: FCM, public bgMode: BackgroundMode,
    public accountTable: AccountTable) {

    accountTable.setSrcClass(this);
    this.initializeApp();

    // used for an example of ngFor and navigation
    // Labels & Pages in navigationbar in upper left corner

    translate.get(['LOGINPAGE', 'PROFILEPAGE', 'LOGOUT', 'LISTSEARCHPAGE', 'MAPPAGE', 'CONTACTREQUESTPAGE', 'MESSAGES']).subscribe(translations => {
      this.pages = [
        { title: translations.PROFILEPAGE, component: "Varier" },
        { title: translations.LISTSEARCHPAGE, component: ListSearchPage },
        { title: translations.MAPPAGE, component: MapPage },
        { title: translations.CONTACTREQUESTPAGE, component: ContactRequestPage },
        { title: translations.MESSAGES, component: MessageListPage },
        { title: translations.LOGOUT, component: LoginPage }
      ];
    });

    // console.log(this.nav.getActive());
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();


      /*
      //background service that runs, when the app is closed.
      this.bgMode.on("enable").subscribe(() => {

        //updates the device token, if user uses a new device
        this.fcm.onTokenRefresh().forEach(token => {
          console.log("on token refresh..");
          this.storage.get("user_id").then(id => {
            console.log("got user id: "+id);
            this.accountTable.getById(id, "", (source, json) => {
              json.body.Token = token;
              this.accountTable.update(id, json, "", (src, res) => { });
            });
          });
        });


        this.fcm.onNotification().subscribe((data)=>{
          if(data.wasTapped){
            //TODO: open page; params: konversation id & name

          }else{
            
          }
        })



      });

      if(!this.bgMode.isActive()){
        //activates the background service if it is not running yet
        this.bgMode.enable();
      }

      */


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

    if (page.component === "Varier") {
      this.storage.get("user_id").then(id => {
        this.varier.forward(false, id);
      });
    } else {
      console.log("in else");
      this.nav.setRoot(page.component);
    }

  }

  //   ionViewWillUnload(orientation:any){
  //        this.screenOrientation.lock(orientation);

  //     setTimeout(function() {
  //         this.screenOrientation.unlock();    
  //     }, 300);        
  //   }
}
