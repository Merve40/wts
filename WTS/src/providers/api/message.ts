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
}
