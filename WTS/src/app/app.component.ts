import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { FCM } from '@ionic-native/fcm';
import { BackgroundMode } from '@ionic-native/background-mode';

import { LoginPage } from '../pages/login/login';
import { Varier } from '../providers/varier';
import { ContactRequestPage } from '../pages/contact_request/contact_request';
import { ListSearchPage } from '../pages/list_search/list_search';
import { MapPage } from '../pages/map/map';
import { NewsfeedPage } from '../pages/newsfeed/newsfeed';
import { MessagePage } from '../pages/message/message_item/message_item';
import { MessageListPage } from '../pages/message/message_list/message_list';
import { AccountTable } from '../providers/api/account';
import { Network } from '../pages/network/network';
import { Settings } from '../pages/settings/settings';

import { TranslateService } from '@ngx-translate/core';

// import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { Globalization } from '@ionic-native/globalization';

enum PushCategory {
  MESSAGE = 'message',
  CONTACT = 'contact-request',
  CONTACT_ACCEPTED = 'contact-accepted'
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public varier: Varier, public storage: Storage, public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, public screenOrientation: ScreenOrientation,
    public translate: TranslateService, public fcm: FCM, public bgMode: BackgroundMode,
    public accountTable: AccountTable, global: Globalization, public events: Events, public toastCtrl: ToastController) {

    accountTable.setSrcClass(this);
    this.initializeApp();

    //this event is only fired when usergroup company is being logged in
    //changes the menu-items in the side-bar
    this.events.subscribe("login", usergroup => {
      this.pages.splice(7, 1);
    });

    //global.getPreferredLanguage().then(result => console.log("This is my language result "+result));

    //global.getPreferredLanguage().then(result => switch (result){
    //   case 'de':
    //     translate.use('de')
    //     break;
    //   case 'en':
    //     translate.use('en')
    //     break;
    //   default: 
    //   translate.setDefaultLang('en');
    // }

    // used for an example of ngFor and navigation
    // Labels & Pages in navigationbar in upper left corner

    translate.get(['LOGINPAGE', 'PROFILEPAGE', 'LOGOUT', 'LISTSEARCHPAGE', 'MAPPAGE', 'CONTACTREQUESTPAGE', 'MESSAGES', 'NETWORK', 'SETTINGS', 'NEWSFEEDPAGE']).subscribe(translations => {
      this.pages = [
        { title: translations.PROFILEPAGE, component: "Varier" },
        { title: translations.NEWSFEEDPAGE, component: NewsfeedPage },
        { title: translations.LISTSEARCHPAGE, component: ListSearchPage },
        { title: translations.MAPPAGE, component: MapPage },
        { title: translations.MESSAGES, component: MessageListPage },
        { title: translations.NETWORK, component: Network },
        { title: translations.CONTACTREQUESTPAGE, component: ContactRequestPage },
        { title: translations.SETTINGS, component: Settings },
        { title: translations.LOGOUT, component: LoginPage }

      ];
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //push notification is only initialized when app is deployed on a device or emulator
      if (this.platform.is('cordova')) {
        this.initializePushNotification();
      }

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

  /**
   * Initializes push notifications and creates a background service.
   */
  initializePushNotification() {
    //background service that runs, when the app is closed.
    this.bgMode.on("enable").subscribe(() => {
      //updates the device token, if user uses a new device
      if (typeof (FCM) !== "undefined") {

        this.fcm.onTokenRefresh().forEach(token => {
          this.storage.get("user_id").then(id => {
            this.accountTable.getById(id, "", (source, json) => {
              json.body.Token = token;
              this.accountTable.update(id, json, "", (src, res) => { });
            });
          });
        });
      }
    });

    if (!this.bgMode.isActive()) {
      //activates the background service if it is not running yet
      this.bgMode.enable();
    }

    let showMessage = (message) => {
      const toast = this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }

    this.fcm.onNotification().subscribe((data) => {
      console.log("==== RECEIVED NOTIFICATION ====");
      console.log(JSON.stringify(data));
      if (data.wasTapped) {
        //TODO open page
        if (data.category == PushCategory.CONTACT) {
          this.nav.setRoot(ContactRequestPage);
        } else if (data.category == PushCategory.MESSAGE) {
          this.nav.setRoot(MessageListPage);
        } else if (data.category == PushCategory.CONTACT_ACCEPTED) {
          this.nav.setRoot(Network);
        }


      } else {
        console.log("not tapped!");
        if (data.category == PushCategory.CONTACT) { //handles contact notification
          console.log("PushCategory: Message");

          // if ContactRequestPage is in foreground
          if (this.nav.last().instance instanceof ContactRequestPage) {
            this.events.publish("contact-requested", data);

          } else {
            //TODO: translation + show sender name 
            showMessage("You have a new contact-request!");
          }

        } else if (data.category == PushCategory.MESSAGE) { //handles message notification

          // if MessagePage is in foreground
          if (this.nav.last().instance instanceof MessagePage) {
            console.log("PushCategory: Message");
            this.events.publish("message-added", data);
          } else {
            //TODO: translation + show sender name 
            showMessage("You have a new message");
          }

        } else if (data.category == PushCategory.CONTACT_ACCEPTED) {
          console.log("PushCategory: CONTACT_ACCEPTED");
          if(this.nav.last().instance instanceof Network){
            this.events.publish("contact-accepted", data.senderId);
          }else{ 
            showMessage("Your request got accepted!");
          }
        }
      }
    });
  }

  /**
   * Navigates to the page from the menu-bar
   * @param page 
   */
  openPage(page) {
    if (page.component === "Varier") {
      this.varier.forward(false, undefined);
    } else {
      if (page.component == LoginPage) {
        this.storage.clear();
      }
      this.nav.setRoot(page.component);
    }
  }

}
