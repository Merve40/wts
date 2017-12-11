import { NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { OnResultComplete } from '../../../providers/api/OnResultComplete';
import { ConversationTable } from '../../../providers/api/conversation'
import { MessagePage } from '../message_item/message_item';
import { MessageTable } from '../../../providers/api/message';

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
        public storage: Storage, public conversationTable: ConversationTable, public messageTable: MessageTable) {

        conversationTable.setSrcClass(this);
        this.storage.get("user_id").then((id) => {
            this.accID = id;
            this.conversationTable.filterByValue("Account_Id_1", id, "query", this.onComplete);
            this.conversationTable.filterByValue("Account_Id_2", this.accID, "query2", this.onComplete);
            
        });
        messageTable.setSrcClass(this);

    }

    /**
     * Navigates to MessagePage to display conversation
     * 
     * @param id unique id of the conversation
     * @param name name of the receiver
     */
    openMessage(id, name) {
        this.navCtrl.push(MessagePage, { id: id, name: name });
    }

    onComplete(flag: string, json: any) {

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
            if (json[0].body) {
                var arr: ConversationItem[] = json as ConversationItem[];
                this.messageArray.push.apply(this.messageArray, arr);
                for (var i = 0; i < this.messageArray.length; i++) {
                    this.conversationTable.getUserTypeByAccountId(json[i].body.Account_Id_2, "" + i, (f, _json) => {
                        var name = getName(_json.body);
                        var _id = json[parseInt(f)].id;
                        this.users.push({ id: _id, userName: name, img: "", lastMessage: "", dateTime: "07.12.2017" });
                    });
                }
            }

        } else if (flag == "query2") {

            if (json[0].body) {
                var arr: ConversationItem[] = json as ConversationItem[];
                this.messageArray.push.apply(this.messageArray, arr);

                for (var i = 0; i < this.messageArray.length; i++) {
                    this.conversationTable.getUserTypeByAccountId(json[i].body.Account_Id_1, "" + i, (f, _json) => {
                        var name = getName(_json.body)
                        var _id = json[parseInt(f)].id; 
                        this.users.push({ id: _id, userName: name, img: "", lastMessage: "", dateTime: "07.12.2017" });
                    });
                }
            }
        }

    }

    ngAfterViewInit() {
    }
}
