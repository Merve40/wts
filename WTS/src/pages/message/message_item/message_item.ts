import { NavController, NavParams, ToastController, Content, Scroll } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { OnResultComplete } from '../../../providers/api/OnResultComplete';
import { MessageTable } from '../../../providers/api/message';

@Component({
    selector: "message_item",
    templateUrl: 'message_item.html'
})
export class MessagePage implements OnResultComplete {

    //Testdaten Konversation
    messages: any = [
        { text: "hello, jane how are you doing?", isOwner: false, style: "txt" },
        { text: "hello john", isOwner: true, style: "txt" },
        {
            text: "I'm doing very good. It has been a long time last we talked,"
            + "how are things going with you now?", isOwner: true, style: "txt"
        },
        { text: "Things are going greate Jane!", isOwner: false, style: "txt" },
        { text: "hello, jane how are you doing?", isOwner: false, style: "txt" },
        { text: "hello john", isOwner: true, style: "txt" },
        {
            text: "I'm doing very good. It has been a long time last we talked,"
            + "how are things going with you now?", isOwner: true, style: "txt"
        },
        { text: "Things are going greate Jane!", isOwner: false, style: "txt" },
        { text: "hello, jane how are you doing?", isOwner: false, style: "txt" },
        { text: "hello john", isOwner: true, style: "txt" },
        {
            text: "I'm doing very good. It has been a long time last we talked,"
            + "how are things going with you now?", isOwner: true, style: "txt"
        },
        { text: "Things are going greate Jane!", isOwner: false, style: "txt" }
    ];

    @ViewChild("content") content: Content;
    @ViewChild("userName", { read: ElementRef }) userName: ElementRef;
    @ViewChild("scrollView") scrollView;
    messageList: any = [];
    message: any;
    accId: string;
    id: string;
    name: string;

    constructor(public navCtrl: NavController, public navparams: NavParams, public translate: TranslateService,
        public storage: Storage, public messageTable: MessageTable) {

        this.id = navparams.get('id');
        this.name = navparams.get('name');
        storage.get('user_id').then((_id) => {
            this.accId = _id;
            messageTable.getByKeyValueSortedBy("Konversation_Id", this.id, "Zeitstempel", "nachrichten-abfrage",
                this.onComplete, 0, true, 15);
        });
    }

    onComplete(flag: string, json: any) {

        if(flag == "nachrichten-abfrage"){
            console.log(json);
            for(var i = 0; i < json.length; i++){
                var item = json[i].body;
                var isOwner;
                if(item.Sender_Id == this.accId){
                    isOwner = true;
                }else{
                    isOwner = false;
                }
                this.messageList.push({test:item.Inhalt, isOwner:isOwner});
            }
        }
    }

    send() {
        this.messages.push({ text: this.message, isOwner: true, style: "" });
        this.message = "";
        this.scrollToBottom();
        //TODO: send message to server
    }

    ngAfterViewInit() {
        this.userName.nativeElement.innerText = this.name;
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.scrollView.nativeElement.scrollTop = this.scrollView.nativeElement.scrollHeight;
    }
}