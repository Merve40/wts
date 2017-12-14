import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Conversation {
    Account_id1: string;
    Account_id2: string;
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

