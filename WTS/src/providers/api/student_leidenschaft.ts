import { Injectable, Inject } from '@angular/core';
import { jsonIgnore } from 'json-ignore';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

@Injectable()
export class Student_LeidenschaftTable extends Base {

    public Student_Leidenschaft: {
        Account_Id:string;
        Leidenschaft_Id: string;
    };

    constructor( @Inject(Api) public api: Api) {
        super(Table.STUDENT_FAHIGKEIT);
    }

    getInnerObject(){
        return this.Student_Leidenschaft;
    }

    setInnerObject(o:any){
        this.Student_Leidenschaft = o;
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