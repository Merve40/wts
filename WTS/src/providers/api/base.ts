import { Api } from './api';

/**
 * Base Class for providing functionalities to Tables.
 */
export abstract class Base {
    public TIMESTAMP={
        ".sv": "timestamp"
    };
    api:Api;
    public table: string;
    public srcClass:any;

    constructor(api:Api, table: string) {
        this.api = api;
        this.table = table;
    }

    /**
     * Retrieves the User (either Student/Company/Uni) by the account id;
     * @param id account id
     * @param flag flag
     * @param func callback function
     */
    getUserTypeByAccountId(id:string, flag:string, func:Function ){
        this.api.getByTable("Account", id, flag, (src, json)=>{
            //generic wrapper callback
            let callback = function(userType, _json) {
                func.apply(src, [flag, {id:_json.id, type:userType, body:_json.body}]);
            }

            if(json.body.Usergruppe == "gruppe_1"){
                this.api.getByValueWithTable("Student", "Account_Id",
                                    json.id, "gruppe_1", callback, this.srcClass);

            }else if(json.body.Usergruppe == "gruppe_2"){
                this.api.getByValueWithTable("Unternehmen", "Account_Id",
                                    json.id, "gruppe_2", callback, this.srcClass);

            }else if(json.body.Usergruppe == "gruppe_3"){
                this.api.getByValueWithTable("Universität", "Account_Id",
                                    json.id, "gruppe_3", callback, this.srcClass);
            }

        }, this.srcClass);
    }

    /**
     * Deletes an object by the given id.
     * 
     * @param id primary key
     * @param source flag
     * @param func callback
     */
     delete(id:string, source:string, func:Function):void{
        this.api.delete(this, id, source, func, this.srcClass);
     }

    /**
     * Updates an object by the given id.
     * 
     * @param id primary key
     * @param source flag
     * @param func callback
     */
    abstract update(id:string, body:any, source:string, func:Function):void;

    /**
     * Creates a new object in the database.
     * 
     * @param t object representing a table 
     * @param func callback function for response => parameter is json
     */
    abstract push(t: any, source:string,  func: Function):void;

    /**
     * Retrieves the object by it's id.
     * 
     * @param base Base
     * @param id push id
     * @param func callback function => param json
     */
     getById(id: string, source:string,  func: Function): void{
        this.api.get(this, id, source, func, this.srcClass);
     }

    /**
     * Retrieves a row by key and value.
     * 
     * @param base Base 
     * @param key Column
     * @param value Value
     * @param func callback function => parameter is json
     */
    getByValue(key: string, value, source:string,  func: Function): void{
        this.api.getByValue(this, key, value, source, func, this.srcClass);
    }

    /**
     * Filters a List for a key and value.
     * 
     * @param base Base
     * @param key Column
     * @param value Value
     * @param func callback function => parameter is jsonArray
     */
    filterByValue(key: string, value: string, source:string, func: Function): void{
        this.api.filterByValue(this, key, value, source, func, this.srcClass);
    }

    /**
     * Filters a List by Key-Value and Limits the number of results.
     * 
     * @param base Base
     * @param key Column
     * @param value Value
     * @param limit max result number
     * @param func callback function => parameter jsonArray
     */
    filterByValueAndLimit(key: string, value: string, limit: number, source:string, func: Function): void{
        this.api.filterByValueAndLimit(this, key, value, limit, source, func, this.srcClass);
    }

    /**
     * Retrieves all entries in one table.
     * 
     * @param source flag 
     * @param func callback
     */
    getAll( source:string, func:Function):void{
        this.api.getAll(this, source, func, this.srcClass);
    }

    /**
     * Get all entries starting with a prefix of a specific field.
     * 
     * @param key field 
     * @param value prefix (not case sensitive)
     * @param source flag
     * @param func callback function => parameter jsonArray
     */
     getAllStartingWith(key:string, value:string, source:string, func:Function):void{
        this.api.startsWith(this, key, value, source, func, this.srcClass);
     }

    /**
     * Get all entries that contain a string of a specific field.
     * 
     * @param key field 
     * @param value string / value
     * @param source flag
     * @param func callback function => parameter jsonArray
     */
     getAllContaining(key:string, value:string, source:string, func:Function):void{
        this.api.getByContains(this, key, value, source, func, this.srcClass);
     }

    /**
     * Retrieves entries filtered by key value pairs and sorted by a given field. 
     * Optionally the starting value and whether it's ascending or descending can be specified.
     * 
     * @param key field 
     * @param value 
     * @param sortKey field to sort by (e.g. timestamp)
     * @param flag source
     * @param func callback
     * @param startAt (optional) starting value for sorting, can be string or number
     * @param ascending (optional) true when ascending, false when descending sort is preferred
     * @param limit (optional) maximum amount of entries to be returned
     */
    getByKeyValueSortedBy(_key:string, _value:string, _sortKey:string, flag:string, func:Function, _startAt?:any, _ascending?:boolean, _limit?:number):void{
        if(!_startAt) _startAt = 0;
        if(!_ascending) _ascending = true;
        if(!_limit) _limit = 0;
        
        var body = {
            tbl: this.table,
            key: _key,
            value: _value,
            sortKey: _sortKey,
            startAt: _startAt,
            ascending: _ascending,
            limit: _limit
        };
        this.api.getByKeyValueSortedBy(body, flag, func, this.srcClass);
    }

    public setSrcClass(srcClass:any):void{
        this.srcClass = srcClass;
    }
}