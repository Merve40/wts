import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapPage } from '../Map/map';
import { StudentTable } from '../../providers/api/student';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { AccountTable, Account } from '../../providers/api/account';



@Component({
  selector: 'page-editpin',
  templateUrl: 'editpin.html'
})
export class EditPinPage implements OnResultComplete {

  pinSid: String;
  accID: String;
  jsonBody: any;

  constructor(public storage: Storage, public StudentTable: StudentTable, public httpClient: HttpClient, public navParams: NavParams) {

    StudentTable.setSrcClass(this);
    this.storage.get('user_id').then(id => {
      this.accID = id;
      this.StudentTable.getByValue("Account_Id", this.accID, "student-abfrage", this.onComplete)

    });
  }

  onComplete(src, json) {
    switch (src) {
      case "student-abfrage": {
        this.jsonBody = json;
        console.log(json);
        if (json.body.PinSid != null) {
          this.setPin().then(sid => {
            this.pinSid = sid;
            console.log(this.pinSid);
            this.jsonBody.body.PinSid = this.pinSid;
            console.log(this.jsonBody);
          })
          console.log(this.jsonBody);
          this.StudentTable.update(this.jsonBody.id, this.jsonBody.body, "", (src, json) => { });
          
        }
      };
      case "": {

      }
    }
  }

  ngAfterViewInit() {
  }

  setPin(): any {
    var url = "http://www.ynfynyty.net/mapapp/api/create.aspx?mapid=509&pwc=hg67UH!&backwardurl=www.testing.worktostudent.com";

    var sid = "";
    var info = this.httpClient.get(url);
    return new Promise((resolve)=> {
      info
      .subscribe(data => {
      }, error => {
        var index = error.url.indexOf("sid=") + 4;
        sid = error.url.substr(index);
        resolve(sid);
      });
    })
  }

  edit() {

  }

}
