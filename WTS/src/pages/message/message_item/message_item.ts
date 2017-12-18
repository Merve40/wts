import { NavController, NavParams, Content, ToastController } from 'ionic-angular';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { OnResultComplete } from '../../../providers/api/OnResultComplete';
import { MessageTable } from '../../../providers/api/message';
import { Events } from 'ionic-angular/util/events';
import { isPageActive } from '../../../app/app.component';
import { NotificationService, NotificationEvent } from '../../../providers/notification_service';

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
    messageList: { text: string, isOwner: boolean }[] = [];
    message: any;
    accId: string;
    id: string;
    name: string;
    imgSource: any;

    constructor(public navCtrl: NavController, public navparams: NavParams, public translate: TranslateService,
        public storage: Storage, public messageTable: MessageTable, public events: Events, public zone: NgZone,
        public toastCtrl: ToastController, public notificationService: NotificationService) {

        this.messageTable.setSrcClass(this);
        this.id = navparams.get('id');
        this.name = navparams.get('name');
        this.imgSource = navparams.get('imgSource');
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
            this.subscribeToMessageEvent();
        }
    }

    /**
     * Sends a Message to the other User.
     * @param event 
     */
    send(event) {
        var self = this;
        var msg = {
            Anhang_Id: "",
            Betreff: "",
            Inhalt: this.message,
            Konversation_Id: this.id,
            Sender_Id: this.accId,
            Zeitstempel: this.messageTable.TIMESTAMP,
            HasSent: false
        }
        this.messageTable.push(msg, "", (src, json) => {});
        this.messageList.push({ text: msg.Inhalt, isOwner: true });
        self.scrollToBottom();
        this.message = "";
    }

    ngAfterViewInit() {
        this.storage.get("user_id").then((_id) => {
            this.accId = _id;
            this.messageTable.getByKeyValueSortedBy("Konversation_Id", this.id, "Zeitstempel", "nachrichten-abfrage",
                this.onComplete, 0, true, 15);
        });
        this.userName.nativeElement.innerText = this.name;
    }

    scrollToBottom() {
        setTimeout(() => {
            this.content.scrollToBottom();
        });
    }

    showMessage(message) {
        const toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    subscribeToMessageEvent() {
        var self = this;

        this.notificationService.subscribe(NotificationEvent.MESSAGE_RECEIVED, (fromServer, data) => {
            if (fromServer) {
                this.messageList.push({ text: data.content, isOwner: false });
                self.scrollToBottom();
                this.notificationService.notify(NotificationEvent.MESSAGE_RECEIVED, false, data);
            }
        });       
    }
}