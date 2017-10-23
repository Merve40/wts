import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-login',
  templateUrl: 'logout.html'
})
export class LogoutPage {

  constructor(public navCtrl: NavController) {
    
  }


  doLogout() {
    //this.user.logout(this.account).subscribe((resp) => {
      this.navCtrl.push(LoginPage);
    //}
  };

}
