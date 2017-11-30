import { NavController, NavParams, Content } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { OnResultComplete } from '../../../providers/api/OnResultComplete';
import { MessageTable } from '../../../providers/api/message';

/**
 * Page for displaying conversation.
 */
@Component({
    selector: "message_item",
    templateUrl: 'message_item.html'
})
export class MessagePage implements OnResultComplete {

    @ViewChild(Content) content: Content;
    @ViewChild("userName", { read: ElementRef }) userName: ElementRef;
    messageList: any = [];
    message: any;
    accId: string;
    id: string;
    name: string;

    constructor(public navCtrl: NavController, public navparams: NavParams, public translate: TranslateService,
        public storage: Storage, public messageTable: MessageTable) {

        this.messageTable.setSrcClass(this);
        this.id = navparams.get('id');
        this.name = navparams.get('name');
        storage.get("user_id").then((_id) => {
            this.accId = _id;
            messageTable.getByKeyValueSortedBy("Konversation_Id", this.id, "Zeitstempel", "nachrichten-abfrage",
                this.onComplete, 0, true, 15);
        });

    }

    onComplete(flag: string, json: any) {

        // retrieves all messages corresponding to the conversation id, sorted by the timestamp
        if (flag == "nachrichten-abfrage") {

            for (var i = 0; i < json.length; i++) {
                var item = json[i].body;
                var isOwner;
                if (item.Sender_Id == this.accId) {
                    isOwner = true;
                } else {
                    isOwner = false;
                }
                this.messageList.push({ text: item.Inhalt, isOwner: isOwner });
            }
            this.scrollToBottom();
        }
    }

    /**
     * Sends a Message to the other User.
     * @param event 
     */
    send(event) {
        this.messageList.push({ text: this.message, isOwner: true, style: "" });
        var msg = {
            Anhang_Id: "",
            Betreff: "",
            Inhalt: this.message,
            Konversation_Id: this.id,
            Sender_Id: this.accId,
            Zeitstempel: this.messageTable.TIMESTAMP
        }
        this.messageTable.push(msg, "", this.onComplete);
        this.message = "";
        this.scrollToBottom();
    }

    notification(data) {
        console.log("in Message Page received notification : \n " + data);
    }

    ngAfterViewInit() {
        this.userName.nativeElement.innerText = this.name;
    }

    ionViewDidEnter() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.content.scrollToBottom();
        });
    }
}