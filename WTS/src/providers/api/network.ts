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
        super(Table.NETZWERK);
    }

    delete(id:string, source:string, func:Function):void{
        this.api.delete(this, id, source, func, this.srcClass);
    }

    update<T extends Base>(id:string, body:Network, source:string, func:Function){
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push<Network>(account: Network, source:string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }

    getById(id:string, source:string, func:Function){
        this.api.get(this, id, source, func, this.srcClass);
    }

    getByValue(key: string, value, source:string, func: Function) {
        this.api.getByValue(this, key, value, source, func, this.srcClass);
    }

    filterByValue(key: string, value: string, source:string, func: Function) {
        this.api.filterByValue(this, key, value, source, func, this.srcClass);
    }

    filterByValueAndLimit(key: string, value: string, limit: number, source:string, func: Function) {
        this.api.filterByValueAndLimit(this, key, value, limit, source, func, this.srcClass);
    }
}

