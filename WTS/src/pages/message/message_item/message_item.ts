import { NavController, NavParams, ToastController, Content, Scroll } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { OnResultComplete } from '../../../providers/api/OnResultComplete';

@Component({
    selector: "message_item",
    templateUrl: 'message_item.html'
  })
export class MessagePage implements OnResultComplete{

//Testdaten Konversation
    messages:any = [
        {text:"hello, jane how are you doing?", isOwner: false, style:"txt"},
        {text:"hello john", isOwner: true, style:"txt"},
        {text:"I'm doing very good. It has been a long time last we talked," 
                +"how are things going with you now?", isOwner: true, style:"txt"},
        {text:"Things are going greate Jane!", isOwner: false, style:"txt"},
        {text:"hello, jane how are you doing?", isOwner: false, style:"txt"},
        {text:"hello john", isOwner: true, style:"txt"},
        {text:"I'm doing very good. It has been a long time last we talked," 
                +"how are things going with you now?", isOwner: true, style:"txt"},
        {text:"Things are going greate Jane!", isOwner: false, style:"txt"},
        {text:"hello, jane how are you doing?", isOwner: false, style:"txt"},
        {text:"hello john", isOwner: true, style:"txt"},
        {text:"I'm doing very good. It has been a long time last we talked," 
                +"how are things going with you now?", isOwner: true, style:"txt"},
        {text:"Things are going greate Jane!", isOwner: false, style:"txt"}
    ];

    testName = "John Doe";

    @ViewChild("content") content:Content;
    @ViewChild("userName", {read: ElementRef}) userName:ElementRef;
    @ViewChild("scrollView") scrollView;
    message:any;

    constructor(public navCtrl:NavController, public navparams:NavParams, public translate:TranslateService,
                public storage:Storage){


    }

    onComplete(flag:string, json:any){

    }

    send(){
        this.messages.push({text:this.message, isOwner:true, style:""});
        this.message = "";
        this.scrollToBottom();
        //TODO: send message to server
    }

    ngAfterViewInit(){
        this.userName.nativeElement.innerText = this.testName;
        this.scrollToBottom();
    }

    scrollToBottom(){
        this.scrollView.nativeElement.scrollTop = this.scrollView.nativeElement.scrollHeight;
    }
}