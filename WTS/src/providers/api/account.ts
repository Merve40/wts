import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Account {
    Adresse_id: string;
    Email: string;
    Passwort: string;
    Usergruppe: string;
}

@Injectable()
export class AccountTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api,Table.ACCOUNT);
    }

    update(id:string, body:Account, source:string, func:Function){
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Account, source:string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }
}

