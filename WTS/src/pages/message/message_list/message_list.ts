import { NavController, NavParams, Events } from 'ionic-angular';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { OnResultComplete } from '../../../providers/api/OnResultComplete';
import { ConversationTable } from '../../../providers/api/conversation'
import { MessagePage } from '../message_item/message_item';
import * as moment from 'moment';
import { isPageActive } from '../../../app/app.component';
import { NotificationService, NotificationEvent } from '../../../providers/notification_service';

export interface MessageItem {
    id: string;
    userName: string;
    img: string;
    lastMessage: string;
    dateTime: string;
    read: boolean;
    imgSource: string;
}

export interface ConversationItem {
    id: string;
    body: {
        Account_Id_1: string;
        Account_Id_2: string;
        Zeitstempel: any;
    }
}

/**
 * Page for displaying all conversations.
 */
@Component({
    selector: "message_list",
    templateUrl: 'message_list.html'
})
export class MessageListPage implements OnResultComplete {

    accID: string;
    messageArray: ConversationItem[] = new Array();
    users: MessageItem[] = new Array();

    constructor(public navCtrl: NavController, public navparams: NavParams, public translate: TranslateService,
        public storage: Storage, public conversationTable: ConversationTable, public events: Events,
        public notificationService: NotificationService) {

        conversationTable.setSrcClass(this);
        console.log("created message-list page..");

    }

    load(): Promise<void> {
        var promise: Promise<void> = new Promise<void>((resolve, reject) => {
            this.messageArray = new Array();
            this.users = new Array();
            this.storage.get("user_id").then((id) => {
                this.accID = id;
                this.conversationTable.filterByValue("Account_Id_1", id, "query", this.onComplete);

                resolve();
            });
        });
        return promise;
    }

    /**
     * Navigates to MessagePage to display conversation
     * 
     * @param id unique id of the conversation
     * @param name name of the receiver
     */
    openMessage(user) {
        user.read = true;

        //notifies everyone listening on this topic that message was read
        this.notificationService.notify(NotificationEvent.MESSAGE_RECEIVED, false, user.id);
        this.navCtrl.push(MessagePage, { id: user.id, name: user.userName, imgSource: user.imgSource });
    }

    onComplete(flag: string, json: any) {

        if (!json) {
            return;
        }
        /**
         * Since the usergroup is not known during the query, 
         * the name is composed by checking all cases for each usergroup.
         * @param js data in JSON-Format
         */
        let getName = (js) => {
            return js.Name ? js.Name + " " + js.Nachname
                : js.Unternehmen ? js.Unternehmen
                    : js.Universität ? js.Universität
                        : "John Doe";
        }


        if (flag == "query") {
            if (json.length > 0) {
                var arr: ConversationItem[] = json as ConversationItem[];
                this.messageArray.push.apply(this.messageArray, arr);
                for (var i = 0; i < this.messageArray.length; i++) {
                    this.conversationTable.getUserTypeByAccountId(json[i].body.Account_Id_2, "" + i, (f, _json) => {
                        var name = getName(_json.body);
                        var _id = json[parseInt(f)].id;
                        var usr = {
                            id: _id, userName: name, img: "", lastMessage: "", dateTime: "07.12.2017", read: true,
                            imgSource: this.getImageByGroup(_json.type)
                        };
                        usr.dateTime = moment(json[parseInt(f)].Zeitstempel).format("HH:mm DD.MM.YYYY");

                        if (this.notificationService.conversations[_id]) {
                            usr.read = false;
                        }
                        this.users.push(usr);
                    });
                }
            }
            this.conversationTable.filterByValue("Account_Id_2", this.accID, "query2", this.onComplete);

        } else if (flag == "query2") {

            if (json.length > 0) {
                var arr: ConversationItem[] = json as ConversationItem[];
                this.messageArray.push.apply(this.messageArray, arr);

                for (var i = 0; i < this.messageArray.length; i++) {
                    this.conversationTable.getUserTypeByAccountId(json[i].body.Account_Id_1, "" + i, (f, _json) => {
                        var name = getName(_json.body)
                        var _id = json[parseInt(f)].id;
                        var usr = {
                            id: _id, userName: name, img: "", lastMessage: "", dateTime: "07.12.2017", read: true,
                            imgSource: this.getImageByGroup(_json.type)
                        };
                        usr.dateTime = moment(json[parseInt(f)].Zeitstempel).format("HH:mm DD.MM.YYYY");

                        if (this.notificationService.conversations[_id]) {
                            usr.read = false;
                        }
                        this.users.push(usr);
                    });
                }
            }
            this.subscribeToConversationEvent();
        }

    }

    getImageByGroup(group: string) {
        if (group == "gruppe_1") {
            return "assets/img/student-image.png";
        } else if (group == "gruppe_2") {
            return "assets/icon/company3.png";
        } else if (group == "gruppe_3") {
            return "assets/icon/university2.png";
        }
    }

    ngAfterViewInit() {
        this.load();
    }

    subscribeToConversationEvent() {
        console.log("subscribed to changes");
        var self = this;
        this.notificationService.subscribe(NotificationEvent.MESSAGE_RECEIVED, (fromServer, data) => {
            if (fromServer) {
                if (!isPageActive(MessageListPage)) {
                    return;
                }
                var user = self.users.find(usr => usr.id == data.conversationId);
                user.read = false;
            }
        });
    }
}
