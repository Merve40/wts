import { NavController, NavParams, ToastController, Content, Scroll } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { OnResultComplete } from '../../../providers/api/OnResultComplete';
import { ConversationTable } from '../../../providers/api/conversation';
import { MessageTable } from '../../../providers/api/message';
import { MessagePage } from '../message_item/message_item';

export interface MessageItem {
    id: string;
    userName: string;
    img: string;
    lastMessage: string;
    dateTime: string;
}

export interface ConversationItem {
    id: string;
    body: {
        Account_Id_1: string;
        Account_Id_2: string;
    }
}

@Component({
    selector: "message_list",
    templateUrl: 'message_list.html'
})
export class MessageListPage implements OnResultComplete {

    accID: string;
    messageArray: ConversationItem[] = new Array();
    users: MessageItem[] = new Array();

    constructor(public navCtrl: NavController, public navparams: NavParams, public translate: TranslateService,
        public storage: Storage, public conversationTable: ConversationTable, public messageTable: MessageTable) {

        conversationTable.setSrcClass(this);
        this.storage.get("user_id").then((id) => {
            this.accID = id;
            this.conversationTable.filterByValue("Account_Id_1", id, "query", this.onComplete);
        });
    }

    openMessage(id, name) {
        this.navCtrl.setRoot(MessagePage, { id: id, name: name });
    }

    onComplete(flag: string, json: any) {

        let getName = (js) => {
            return js.Name ? js.Name + " " + js.Nachname
                : js.Unternehmen ? js.Unternehmen
                    : js.Universität ? js.Universität
                        : "John Doe";
        }

        if (flag == "query") {
          
            if (json[0].body) {
                var arr: ConversationItem[] = json as ConversationItem[];
                this.messageArray.push.apply(this.messageArray, arr);

                Promise.resolve()
                    .then(() => {

                        for (var i = 0; i < this.messageArray.length; i++) {
                            this.conversationTable.getUserTypeByAccountId(json[i].body.Account_Id_2, ""+i, (f, _json) => {
                                var name = getName(_json.body);
                                var _id = json[parseInt(f)].id;
                                this.users.push({ id: _id, userName: name, img: "", lastMessage: "hello", dateTime: "06.11.2017" });
                            });
                        }

                        return Promise.resolve();
                    }).then(() => {
                        this.conversationTable.filterByValue("Account_Id_2", this.accID, "query2", this.onComplete);
                    });
            }

        } else if (flag == "query2") {

            if (json[0].body) {
                var arr: ConversationItem[] = json as ConversationItem[];
                this.messageArray.push.apply(this.messageArray, arr);

                for (var i = 0; i < this.messageArray.length; i++) {
                    this.conversationTable.getUserTypeByAccountId(json[i].body.Account_Id_1, ""+i, (f, _json) => {
                        var name = getName(_json.body);
                        var _id = json[parseInt(f)].id;
                        this.users.push({ id: _id, userName: name, img: "", lastMessage: "hello", dateTime: "06.11.2017" });
                    });
                }
            }
        }

    }

    ngAfterViewInit() {
    }
}
