import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Fähigkeit {
    Fähigkeit: string;
}

@Injectable()
export class SkillTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.FAHIGKEIT);
    }

    update(id: string, body: Fähigkeit, source: string, func: Function) {
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Account, source: string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }

}