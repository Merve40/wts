import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Block {
    Profil_Info_id: string;
}

@Injectable()
export class BlockTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.BLOCK);
    }

    update(id: string, body: Block, source: string, func: Function) {
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Block, source: string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }

}

