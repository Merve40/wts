import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Group {
    Group: string;
}

@Injectable()
export class GroupTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.USER_GRUPPE);
    }

    update(id: string, body: Group, source: string, func: Function) {
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Group, source: string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }

}

