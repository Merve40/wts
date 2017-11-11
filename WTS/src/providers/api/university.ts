import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface University{
    Account_id;
    Universität:string;
    Fachrichtungen:string;
}

@Injectable()
export class UniversityTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.UNIVERSITAT);
    }

    update(id:string, body:University, source:string, func:Function){
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: University, source:string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }

}

