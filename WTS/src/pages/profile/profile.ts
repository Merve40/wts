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
    adresse: any;
    
    constructor(public navCtrl: NavController) {
    }

    ngAfterViewInit(){
    var userId = '-KwFGCd3o-zKe7UoUKoR';
    return firebase.database().ref('/Account/' + userId).once('value').then(function(snapshot) {
      var userObject = snapshot.val();
      console.log(userObject);
      //test
      this.adresse = userObject.Adresse_id;
      console.log(this.adresse);
    });
  }
  }