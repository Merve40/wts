import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Attachement {
    Account_id: string;
    Anhang: string;
    Datei_Typ: string;
}

@Injectable()
export class AttachementTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.ANHANG);
    }

    update(id: string, body: Attachement, source: string, func: Function) {
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Attachement, source: string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }

}

