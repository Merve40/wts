import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Student_Skill{
    Account_Id:string;
    Fähigkeit_Id:string;
}

@Injectable()
export class Student_SkillTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.STUDENT_FAHIGKEIT);
    }

    update(id:string, body:Student_Skill, source:string, func:Function){
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Student_Skill, source:string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }

}