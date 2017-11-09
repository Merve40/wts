import { NavController, NavParams, ToastController, Content, Scroll } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// import { Storage } from '@ionic/storage';

@Component({
    selector: "message_list",
    templateUrl: 'message_list.html'
})
export class MessageListPage {

    //Testdaten Nachtichtenliste
    messages:any = [
        {id: 0, userName:"John Doe", img:"https://goo.gl/images/MyjyYu", lastMessage:"hello", dateTime:"20:49"},
        {id: 1, userName:"Max Mustermann", img:"https://goo.gl/images/MyjyYu", lastMessage:"test", dateTime:"19:54"},
        {id: 2, userName:"Michael Scott", img:"https://goo.gl/images/MyjyYu", lastMessage:"goodbye", dateTime:"07.11.2017"},
        {id: 3, userName:"Dwight Schrute", img:"https://goo.gl/images/MyjyYu", lastMessage:"how are you?", dateTime:"06.11.2017"},
        {id: 4, userName:"Jim Halpter", img:"https://goo.gl/images/MyjyYu", lastMessage:"see u later", dateTime:"17.10.2017"},
        {id: 5, userName:"Pam Beesly", img:"https://goo.gl/images/MyjyYu", lastMessage:"by", dateTime:"01.10.2017"}
    ];

    constructor(public navCtrl: NavController, public navparams: NavParams, public translate: TranslateService) {
    }

    openMessage(id){
        console.log(id);
    }

    ngAfterViewInit(){
        //TODO: load list
    }
}