import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

import * as EventSource from 'eventsource';

export interface Kontaktanfrage {
    receiver: string;
    sender: string;
    request: boolean;
    message: string;
    Zeitstempel: any;
}

@Injectable()
export class ContactRequestTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.KONTAKTANFRAGE);
    }

    update(id: string, body: Kontaktanfrage, source: string, func: Function) {
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Kontaktanfrage, source: string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }
}

