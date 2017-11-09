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
    Vertiefung: String;
    Zeitstempel: String;
}

@Injectable()
export class StudentTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.STUDENT);
    }

    delete(id:string, source:string, func:Function):void{
        this.api.delete(this, id, source, func, this.srcClass);
    }

    update<T extends Base>(id:string, body:Student, source:string, func:Function){
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push<Student>(account: Student, source:string, func: Function) {
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

    getAll( source:string, func:Function){
        this.api.getAll(this, source, func, this.srcClass);
    }
    
    getAllStartingWith(key:string, value:string, source:string, func:Function){
        this.api.startsWith(this, key, value, source, func, this.srcClass);
    }

    getAllContaining(key:string, value:string, source:string, func:Function){
        this.api.getByContains(this, key, value, source, func, this.srcClass);
    }
}

