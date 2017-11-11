import { Injectable, Inject } from '@angular/core';
import { Base } from './base';
import { Api } from './api';
import { Table } from './table';

export interface Visibility{
    Account_Id:string;
    Block_Id:string;
    Gruppe_Id:string;
    Sichtbar:boolean;
}

@Injectable()
export class VisibilityTable extends Base {

    constructor( @Inject(Api) public api: Api) {
        super(api, Table.SICHTBARKEIT);
    }
    
    update(id:string, body:Visibility, source:string, func:Function){
        this.api.put(this, id, body, source, func, this.srcClass);
    }

    push(account: Visibility, source:string, func: Function) {
        this.api.post(this, account, source, func, this.srcClass);
    }

}
