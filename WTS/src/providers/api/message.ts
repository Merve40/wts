import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

import * as EventSource from 'eventsource';

export interface Message {
    Anhang_Id: string;
    Betreff: string;
    Inhalt: string;
    Konversation_Id: string;
    Sender_Id: string;
    Zeitstempel:any;
    HasSent:boolean;
}

@Injectable()
export class MessageTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.NACHRICHT);
    }

    update(id: string, body: Message, source: string, func: Function) {
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(message: Message, source: string, func: Function) {
        this.api.post(this, message, source, func, this.srcClass);
    }

    onMessageReceived(conversationId:string, callback){
        console.log("creating event-source");
        var url = "https://worktostudents.firebaseio.com/Nachricht"
            +".json?orderBy=\"Konversation_Id\"&equalTo=\""+conversationId+"\"&limitToLast=1";
        var eventSource = new EventSource(url); //EventSource is a basic library, thus integrated in Javascript
        
        if(eventSource != null || eventSource != undefined){
            console.log("created event-source successfully..");
            // eventSource.addEventListener("patch", callback);
            eventSource.addEventListener("put", callback);
            // eventSource.onmessage = callback;
        }
        
    }
}
