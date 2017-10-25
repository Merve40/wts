import { Base } from './base';
import { Api } from './api';
import { Table } from './table';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class AdresseTable extends Base {

    public Adresse: {
        Straße: string,
        Ort: string,
        PLZ: string,
        Land: string
    };

    constructor( @Inject(Api) public api: Api) {
        super(Table.ADRESSE);
    }

    getInnerObject(){
        return this.Adresse;
    }

    setInnerObject(o:any):void{
        this.Adresse = o;
    }

    delete(source:string, func:Function):void{
        this.api.delete(this, source, func);
    }

    update<T extends Base>(source:string, func:Function){
        this.api.put(this, source, func);
    }

    push<Account>(account: Account, source:string, func: Function) {
        this.api.post(this, account, source, func);
    }

    getById(id:string, source:string, func:Function){
        this.api.get(this, id, source, func);
    }

    getByValue(key: string, value, source:string, func: Function) {
        this.api.getByValue(this, key, value, source, func);
    }

    filterByValue(key: string, value: string, source:string, func: Function) {
        this.api.filterByValue(this, key, value, source, func);
    }

    filterByValueAndLimit(key: string, value: string, limit: number, source:string, func: Function) {
        this.api.filterByValueAndLimit(this, key, value, limit, source, func);
    }
}