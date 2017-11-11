import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Leidenschaft{
    Leidenschaft:string;
}

@Injectable()
export class PassionTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.LEIDENSCHAFT);
    }

    update(id:string, body:Leidenschaft, source:string, func:Function){
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Leidenschaft, source:string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }

}
