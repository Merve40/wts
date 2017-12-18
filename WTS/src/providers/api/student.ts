import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Student{
    Abschluss: String;
    Abschluss_Datum: String;
    Account_id: String;
    Beschreibung: String;
    Beschäftigung: String;
    Geb_Datum: String;
    Nachname: String;
    Name: String;
    Semester: String;
    Studiengang: String;
    Uni: String;
    PinSid: String;
    Vertiefung: String;
    Zeitstempel: String;
}

@Injectable()
export class StudentTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.STUDENT);
    }

    update(id:string, body:Student, source:string, func:Function){
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Student, source:string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }

}

