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
import { NotificationService, parseEvent, NotificationEvent } from '../providers/notification_service';

enum PushCategory {
  MESSAGE = 'message',
  CONTACT = 'contact-request',
  CONTACT_ACCEPTED = 'contact-accepted'
}

enum Badge {
  MESSAGE = 'message',
  CONTACT_REQUEST = 'contact',
  NETWORK = 'network'
}

interface Page {
  title: string;
  component: any;
  badgeName: string;
  badge: number;
  badgeVisible: boolean;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  accId: string;
  unreadMessages = {};
  rootPage: any = LoginPage;

  pages: Page[] = [];
  companyPages: Page[] = [];
  studentPages: Page[] = [];

  constructor(public varier: Varier, public storage: Storage, public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, public screenOrientation: ScreenOrientation,
    public translate: TranslateService, public fcm: FCM, public bgMode: BackgroundMode,
    public accountTable: AccountTable, global: Globalization, public events: Events, public toastCtrl: ToastController,
    public notificationService: NotificationService) {

    accountTable.setSrcClass(this);
    this.initializeApp();

    
    var sprache;
    global.getPreferredLanguage().then(result => {
      sprache = result.value;
      console.log("Device Language is: " + sprache);

      switch (sprache) {
        case 'de-DE':
          translate.use('de')
          break;

        case 'de':
        translate.use('de')
        break;

        case 'Deutsch':
        translate.use('de')
        break;

        case 'en-US':
          translate.use('en');
          break;

        case 'en-GB':
          translate.use('en');
          break;

        case 'en-IN':
          translate.use('en');
          break;

        case 'en-AU':
          translate.use('en');
          break;
        
        case 'en-US':
          translate.use('en');
          break;

        case 'en':
        translate.use('en')
        break;

        default:
          translate.use('en');
          //translate.use('de');
      }
    });

    translate.get(['LOGINPAGE', 'PROFILEPAGE', 'LOGOUT', 'LISTSEARCHPAGE', 'MAPPAGE', 'CONTACTREQUESTPAGE', 'MESSAGES', 'NETWORK', 'SETTINGS', 'NEWSFEEDPAGE']).subscribe(translations => {
      this.studentPages = [
        { title: translations.PROFILEPAGE, component: "Varier", badgeName: '', badge: 0, badgeVisible: false },
        { title: translations.NEWSFEEDPAGE, component: NewsfeedPage, badgeName: '', badge: 0, badgeVisible: false },
        { title: translations.LISTSEARCHPAGE, component: ListSearchPage, badgeName: '', badge: 0, badgeVisible: false },
        { title: translations.MAPPAGE, component: MapPage, badgeName: '', badge: 0, badgeVisible: false },
        { title: translations.MESSAGES, component: MessageListPage, badgeName: Badge.MESSAGE, badge: 0, badgeVisible: false },
        { title: translations.NETWORK, component: Network, badgeName: Badge.NETWORK, badge: 0, badgeVisible: false },
        { title: translations.CONTACTREQUESTPAGE, component: ContactRequestPage, badgeName: Badge.CONTACT_REQUEST, badge: 0, badgeVisible: false },
        { title: translations.SETTINGS, component: Settings, badgeName: '', badge: 0, badgeVisible: false },
        { title: translations.LOGOUT, component: LoginPage, badgeName: '', badge: 0, badgeVisible: false }
      ];
      this.companyPages = this.studentPages.slice();
      this.companyPages.splice(7, 1);
    });

    //this event is only fired when usergroup company is being logged in
    //changes the menu-items in the side-bar
    this.events.subscribe("login", (id, usergroup) => {
      this.accId = id;

      if (usergroup == "gruppe_1") {
        this.pages = this.studentPages;
      } else if (usergroup == "gruppe_2") {
        this.pages = this.companyPages;
      }

      //sets the amount of unanswered contact-requests
      this.initalizeMenu();
    });

  }

  initalizeMenu() {
    var amount = this.notificationService.contactRequests;
    var page = this.pages.find(p => p.badgeName == Badge.CONTACT_REQUEST);

    if (amount) {
      page.badge = amount;
      page.badgeVisible = true;
    }

    var messages = this.notificationService.messages;
    var mPage = this.pages.find(p => p.badgeName == Badge.MESSAGE);

    if (messages) {
      mPage.badge = messages;
      mPage.badgeVisible = true;
    }

    var newContacts = this.notificationService.newContacts;
    var cPage = this.pages.find(p => p.badgeName == Badge.NETWORK);
    if (newContacts) {
      cPage.badge = newContacts;
      cPage.badgeVisible = true;
    }
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

    //initializing events
    this.notificationService.subscribe(NotificationEvent.MESSAGE_RECEIVED, (fromServer,data) => {
      console.log("received notification..");
      var page = this.pages.find(p => p.badgeName == Badge.MESSAGE);
      console.log("page found : "); 
      console.log(page);
      page.badge = this.notificationService.messages;
      page.badgeVisible = false;
      if (this.notificationService.messages) {
        page.badgeVisible = true;
      }
    });

    this.notificationService.subscribe(NotificationEvent.CONTACT_REQUESTED, (fromServer,data) => {
      var page = this.pages.find(p => p.badgeName == Badge.CONTACT_REQUEST);
      page.badge = this.notificationService.contactRequests;
      page.badgeVisible = false;
      if (this.notificationService.contactRequests) {
        page.badgeVisible = true;
      }
    });

    this.notificationService.subscribe(NotificationEvent.CONTACT_ACCEPTED, (fromServer, data) => {
      var page = this.pages.find(p => p.badgeName == Badge.NETWORK);
      page.badge = this.notificationService.newContacts;
      page.badgeVisible = false;
      if (this.notificationService.newContacts) {
        page.badgeVisible = true;
      }
    });
  }

  /**
   * Initializes push notifications and creates a background service.
   */
  initializePushNotification() {

    //activates the background service if it is not running yet
    if (!this.bgMode.isActive()) {
      this.bgMode.enable();
    }

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

      var event: NotificationEvent = parseEvent(data.category);
      if (data.wasTapped) {

        //TODO open page
        if (data.category == PushCategory.CONTACT) {

          this.notificationService.notify(event, true, data);

        } else if (data.category == PushCategory.MESSAGE) {

          this.notificationService.notify(event, true, data);

        } else if (data.category == PushCategory.CONTACT_ACCEPTED) {

          this.notificationService.notify(event, true, data);
        }


      } else {
        console.log("not tapped!");

        if (data.category == PushCategory.CONTACT) {

          console.log("PushCategory: Contact-Request");
          this.notificationService.notify(event, true, data);
          showMessage("You have a new contact request");

        } else if (data.category == PushCategory.MESSAGE) {

          console.log("PushCategory: Message");
          this.notificationService.notify(event, true, data);
          showMessage("You have a new message");

        } else if (data.category == PushCategory.CONTACT_ACCEPTED) {

          console.log("PushCategory: CONTACT_ACCEPTED");
          this.notificationService.notify(event, true, data);
          showMessage("Your contact request got accepted");

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
        this.storage.set("user_id", undefined);
      }
      this.nav.setRoot(page.component);
    }
  }

}
export function isPageActive(page): boolean {
  return this.nav.last().instance instanceof page;
}