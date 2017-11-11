import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Profil_Info {
    Info: string;
}

@Injectable()
export class Profil_InfoTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.PROFIL_INFO);
    }

    update(id: string, body: Profil_Info, source: string, func: Function) {
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Profil_Info, source: string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }
}

