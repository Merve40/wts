import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Network{
    Account_id1: string;
    Account_id2: string;
}

@Injectable()
export class NetworkTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.NETZWERK);
    }

    update(id:string, body:Network, source:string, func:Function){
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Network, source:string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }

}

