import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { OnResultComplete } from '../../../providers/api/OnResultComplete';

//test daten
// var name = "John Doe";
// var msg1 = "Hello Jane!";
// var msg2 = "Hello John";
// var timestamp;

@Component({
    templateUrl: 'message_item.html'
  })
export class MessagePage implements OnResultComplete{



    constructor(public navCtrl:NavController, public navparams:NavParams, public translate:TranslateService,
                public storage:Storage){


    }

    onComplete(flag:string, json:any){

    }


}