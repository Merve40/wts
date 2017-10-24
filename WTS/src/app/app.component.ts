import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { Profile_externPage } from '../pages/profile_extern/profile_extern';

import firebase from 'firebase';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, 
    public splashScreen: SplashScreen, public sceenOrientation: ScreenOrientation) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    // Labels & Pages in navigationbar in upper left corner
    this.pages = [
      { title: 'Login', component: LoginPage },
      {title: 'Profile', component: ProfilePage},
      { title: 'Logout', component: LoginPage },
      { title: 'Profile_extern', component: Profile_externPage }

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      console.log(this.sceenOrientation.type);    
      //this.sceenOrientation.lock(this.sceenOrientation.ORIENTATIONS.PORTRAIT);
      console.log(this.sceenOrientation.type);
     
      
    });
    firebase.initializeApp({
      apiKey: "AIzaSyATDKANyR1HnCajqaAXINVS0z6kfCBwRwI",
      authDomain: "worktostudents.firebaseapp.com",
      databaseURL: "https://worktostudents.firebaseio.com",
      projectId: "worktostudents",
      storageBucket: "worktostudents.appspot.com",
      messagingSenderId: "542302693567"
    });
    
    
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
