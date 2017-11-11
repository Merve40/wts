import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Message {
    Anhang_Id: string;
    Betreff: string;
    Inhalt: string;
    Konversation_Id: string;
    Sende_Id: string;
}

@Injectable()
export class MessageTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.NACHRICHT);
    }

    update(id: string, body: Message, source: string, func: Function) {
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Message, source: string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }
}
