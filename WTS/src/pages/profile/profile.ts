import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import firebase from 'firebase';

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
  })

  export class ProfilePage{

    database:any = firebase.database(); 
    storage:any = firebase.storage(); //file system (Dateien)
    
    constructor(public navCtrl: NavController) {
    }

  ngAfterViewInit(){
    var studentID = 'student_10';
    var AccID = 'acc_10';
    firebase.database().ref('/Student/' + studentID).once('value').then(function(snapshot) {
      //var userObject = snapshot.val();
      var nachname = (snapshot.val().Nachname);
      var vorname = (snapshot.val().Name);
      console.log(nachname);
      console.log(vorname); 
  })

   firebase.database().ref('/Account/' + AccID).once('value').then(function(snapshot) {
    //var userObject = snapshot.val();
    var email = (snapshot.val().Email);
    console.log(email);
})
}
  }