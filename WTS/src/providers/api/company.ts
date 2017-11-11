import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Company {
    Unternehmen: string;
    Webseite: string;
    Account_id: string;
    Branche: string;
}

@Injectable()
export class CompanyTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.UNTERNEHMEN);
    }

    update(id: string, body: Company, source: string, func: Function) {
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Company, source: string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }

}

