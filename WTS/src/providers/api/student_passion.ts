import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Student_Passion{
    Account_Id:string;
    Leidenschaft_Id: string;
}

@Injectable()
export class Student_PassionTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api,Table.STUDENT_LEIDENSCHAFT);
    }

    update(id:string, body:Student_Passion, source:string, func:Function){
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Student_Passion, source:string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }

}