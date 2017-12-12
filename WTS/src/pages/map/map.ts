import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StudentTable } from '../../providers/api/student';
import { AccountTable } from '../../providers/api/account';
import { AdressTable } from '../../providers/api/adress';
import { Student_SkillTable } from '../../providers/api/student_skill';
import { SkillTable } from '../../providers/api/skill';
import { Student_PassionTable } from '../../providers/api/student_passion';
import { PassionTable } from '../../providers/api/passion';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage implements OnResultComplete {


  constructor(public navCtrl: NavController, public AdressTable: AdressTable, public StudentTable: StudentTable, public AccountTable: AccountTable, public StudentSkillTable: Student_SkillTable, public SkillTable: SkillTable, public PassionTable: PassionTable, public StudentPassionTable: Student_PassionTable, public httpClient: HttpClient) {
    StudentTable.setSrcClass(this);
    AccountTable.setSrcClass(this);
    AdressTable.setSrcClass(this);
    StudentSkillTable.setSrcClass(this);
    SkillTable.setSrcClass(this);
    PassionTable.setSrcClass(this);
    StudentPassionTable.setSrcClass(this);
  }

  onComplete() {
  }

  ngAfterViewInit() {
  }

  openSetPinPage() {

    var url = "http://www.ynfynyty.net/mapapp/api/create.aspx?mapid=509&pwc=hg67UH!&backwardurl=www.testing.worktostudent.com";

    var info = this.httpClient.get(url);
    info
      .subscribe(data => {
        console.log('my data: ', data);
      }, error => {
        console.log('my error: ', error)
      })

  }
}

