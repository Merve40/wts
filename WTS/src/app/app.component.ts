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

enum Badge {
  MESSAGE = 'message',
  CONTACT_REQUEST = 'contact'
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

  unreadMessages = {};
  rootPage: any = LoginPage;

  pages: Page[] = [];
  companyPages: Page[] = [];
  studentPages: Page[] = [];

  constructor(public varier: Varier, public storage: Storage, public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, public screenOrientation: ScreenOrientation,
    public translate: TranslateService, public fcm: FCM, public bgMode: BackgroundMode,
    public accountTable: AccountTable, global: Globalization, public events: Events, public toastCtrl: ToastController) {

    accountTable.setSrcClass(this);
    this.initializeApp();

    //this event is only fired when usergroup company is being logged in
    //changes the menu-items in the side-bar
    this.events.subscribe("login", usergroup => {
      if (usergroup == "gruppe_1") {
        this.pages = this.studentPages;
      } else if (usergroup == "gruppe_2") {
        this.pages = this.companyPages;
      }
    });

    translate.get(['LOGINPAGE', 'PROFILEPAGE', 'LOGOUT', 'LISTSEARCHPAGE', 'MAPPAGE', 'CONTACTREQUESTPAGE', 'MESSAGES', 'NETWORK', 'SETTINGS', 'NEWSFEEDPAGE']).subscribe(translations => {
      this.studentPages = [
        { title: translations.PROFILEPAGE, component: "Varier", badgeName: '', badge: 0, badgeVisible: false },
        { title: translations.NEWSFEEDPAGE, component: NewsfeedPage, badgeName: '', badge: 0, badgeVisible: false },
        { title: translations.LISTSEARCHPAGE, component: ListSearchPage, badgeName: '', badge: 0, badgeVisible: false },
        { title: translations.MAPPAGE, component: MapPage, badgeName: '', badge: 0, badgeVisible: false },
        { title: translations.MESSAGES, component: MessageListPage, badgeName: Badge.MESSAGE, badge: 0, badgeVisible: false },
        { title: translations.NETWORK, component: Network, badgeName: '', badge: 0, badgeVisible: false },
        { title: translations.CONTACTREQUESTPAGE, component: ContactRequestPage, badgeName: Badge.CONTACT_REQUEST, badge: 0, badgeVisible: false },
        { title: translations.SETTINGS, component: Settings, badgeName: '', badge: 0, badgeVisible: false },
        { title: translations.LOGOUT, component: LoginPage, badgeName: '', badge: 0, badgeVisible: false }
      ];
      this.companyPages = this.studentPages.slice();
      this.companyPages.splice(7, 1);
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
    this.events.subscribe("message-read", (conversationId) => {
      this.updateBadge(Badge.MESSAGE, false);
      delete this.unreadMessages[conversationId];
    });
    this.events.subscribe("contact-request-viewed", () => {
      this.updateBadge(Badge.CONTACT_REQUEST, false, 0);
    });

    //restores badges and unreadMessages after application is opened
    this.platform.resume.subscribe(() => {

      this.pages.forEach((page) => {
        if (page.badgeName) {
          this.storage.get(page.badgeName).then((badge) => {
            page.badge = badge;
          });
        }
      });

      this.storage.get("unread-messages").then(data => {
        this.unreadMessages = data;
      });
    });

    //saves badges before application is closed
    this.platform.pause.subscribe(() => {

      this.pages.forEach(p => {
        if (p.badgeName) {
          this.storage.set(p.badgeName, p.badge);
        }
      });

      this.storage.set("unread-messages", this.unreadMessages);
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

    var savedBadges: boolean = false;

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
      console.log(JSON.stringify(data));
      if (data.wasTapped) {
        //TODO open page
        if (data.category == PushCategory.CONTACT) {
          this.nav.setRoot(ContactRequestPage);
          
        } else if (data.category == PushCategory.MESSAGE) {
          this.updateBadge(Badge.MESSAGE, true);
          this.unreadMessages[data.conversationId] = {message: data.content, timestamp: data.Zeitstempel};
          this.nav.setRoot(MessageListPage);

        } else if (data.category == PushCategory.CONTACT_ACCEPTED) {
          this.updateBadge(Badge.CONTACT_REQUEST, true);
          this.nav.setRoot(Network);
        }


      } else {
        console.log("not tapped!");
        if (data.category == PushCategory.CONTACT) { //handles contact notification
          console.log("PushCategory: Contact-Request");
          this.updateBadge(Badge.CONTACT_REQUEST, true);

          // if ContactRequestPage is in foreground
          if (this.nav.last().instance instanceof ContactRequestPage) {
            this.events.publish("contact-requested", data);

          } else {
            //TODO: translation + show sender name 
            showMessage("You have a new contact-request!");
          }

        } else if (data.category == PushCategory.MESSAGE) { //handles message notification
          console.log("PushCategory: Message");
          this.updateBadge(Badge.MESSAGE, true);
          this.unreadMessages[data.conversationId] = {message: data.content, timestamp: data.Zeitstempel};
          // if MessagePage is in foreground
          if (this.nav.last().instance instanceof MessagePage) {
            this.events.publish("message-added", data);
            
          } else if(this.nav.last().instance instanceof MessageListPage){
            console.log("event:message-received");  
            this.events.publish("message-received", data);      
               

          } else {
            //TODO: translation + show sender name 
            showMessage("You have a new message");
          }

        } else if (data.category == PushCategory.CONTACT_ACCEPTED) {
          console.log("PushCategory: CONTACT_ACCEPTED");
          if (this.nav.last().instance instanceof Network) {
            this.events.publish("contact-accepted", data);
          } else {
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
    } else if (page.component == MessageListPage) {
      this.nav.setRoot(page.component, { unreadMessages: this.unreadMessages });
    } else {
      if (page.component == LoginPage) {
        this.storage.clear();
      }
      this.nav.setRoot(page.component);
    }
  }

  /**
   * Updates the badge number on the menu bar.
   * 
   * @param badge Badge Item e.g. MessagePage 
   * @param doIncrement boolean
   */
  updateBadge(badge: Badge, doIncrement: boolean, badgeNumber?: number): void {
    this.pages.forEach(page => {
      if (page.badgeName == badge) {
        if (badgeNumber) {
          page.badge = badgeNumber;
          if (doIncrement) {
            page.badgeVisible = true;
          } else {
            page.badgeVisible = false;
          }
          return;

        } else if (doIncrement) {
          page.badge = page.badge + 1;
          page.badgeVisible = true;
          return;

        } else {
          page.badge = page.badge - 1;
          if (page.badge == 0) {
            page.badgeVisible = false;
          }
          return;
        }
      }
    });
  }

}
