import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

import * as EventSource from 'eventsource';
import { eventNames } from 'cluster';

export interface Conversation {
    Account_Id_1: string;
    Account_Id_2: string;
    Zeitstempel: any;
}

@Injectable()
export class ConversationTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.KONVERSATION);
    }

    update(id: string, body: Conversation, source: string, func: Function) {
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Conversation, source: string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }
}

