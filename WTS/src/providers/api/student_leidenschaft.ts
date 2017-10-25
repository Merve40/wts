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

    delete(func:Function):void{
        this.api.delete(this, func);
    }

    update<T extends Base>(func:Function){
        this.api.put(this, func);
    }

    push<Account>(account: Account, func: Function) {
        this.api.post(this, account, func);
    }

    getById(id:string, func:Function){
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