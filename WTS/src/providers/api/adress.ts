import { Base } from './base';
import { Api } from './api';
import { Table } from './table';
import { Inject, Injectable } from '@angular/core';

export interface Adresse {
    Straße: string;
    Ort: string;
    PLZ: string;
    Land: string;
}

@Injectable()
export class AdressTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.ADRESSE);
    }

    update(id:string, body:Adresse, source:string, func:Function){
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Adresse, source:string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }
}