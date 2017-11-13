import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StudentTable } from '../../providers/api/student';
import { AccountTable } from '../../providers/api/account';
import { AdressTable } from '../../providers/api/adress';
import { Student_SkillTable } from '../../providers/api/student_skill';
import { SkillTable } from '../../providers/api/skill';
import { Student_PassionTable } from '../../providers/api/student_passion';
import { PassionTable } from '../../providers/api/passion';
import { ProfileVarier } from '../profile_varier/profile_varier';
import { OnResultComplete } from '../../providers/api/OnResultComplete';


@Component({
  selector: 'page-contact_request',
  templateUrl: 'contact_request.html'
})
export class ContactRequestPage implements OnResultComplete {

  constructor(public navCtrl: NavController) {

  }

  onComplete(src, json) {
    switch (src) {
      case "": {}
      default: {
        break;
      }
    }
}
}
