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

    delete(func:Function){
        this.api.delete(this, func);
    }

    update(func:Function){
        this.api.put(this, func);
    }

    push<Adresse>(adresse: Adresse, func: Function) {
        this.api.post(this, adresse, func);
    }

    getById( id:string, func:Function){
        this.api.get(this, id, func);
    }

    getByValue(key: string, value, func: Function) {
        this.api.getByValue(this, key, value, func);
    }

    filterByValue(key: string, value: string, func: Function) {
        this.api.filterByValue(this, key, value, func);
    }

    filterByValueAndLimit(key: string, value: string, limit: number, func: Function) {
        this.api.filterByValueAndLimit(this, key, value, limit, func);
    }
}