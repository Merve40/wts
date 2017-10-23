import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import firebase from 'firebase';

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
  })

  export class ProfilePage{

    database:any = firebase.database(); 
    storage:any= firebase.storage(); //file system (Dateien)
    
    constructor(public navCtrl: NavController) {
    }

  }