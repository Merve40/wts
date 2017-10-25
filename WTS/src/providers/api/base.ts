import { jsonIgnore } from 'json-ignore';

export abstract class Base {

    @jsonIgnore()
    public id: string;

    @jsonIgnore()
    public table: string;

    constructor(table: string) {
        this.table = table;
    }

    abstract delete(func:Function):void;

    abstract update(func:Function):void;

    /**
     * Creates a new object in the database.
     * 
     * @param t object representing a table 
     * @param func callback function for response => parameter is json
     */
    abstract push<T>(t: T, func: Function):void;

    /**
     * Retrieves the object by it's id.
     * 
     * @param base Base
     * @param id push id
     * @param func callback function => param json
     */
    abstract getById(id: string, func: Function): void;

    /**
     * Retrieves a row by key and value.
     * 
     * @param base Base 
     * @param key Column
     * @param value Value
     * @param func callback function => parameter is json
     */
    abstract getByValue(key: string, value, func: Function): void;

    /**
     * Filters a List for a key and value.
     * 
     * @param base Base
     * @param key Column
     * @param value Value
     * @param func callback function => parameter is jsonArray
     */
    abstract filterByValue(key: string, value: string, func: Function): void;

    /**
     * Filters a List by Key-Value and Limits the number of results.
     * 
     * @param base Base
     * @param key Column
     * @param value Value
     * @param limit max result number
     * @param func callback function => parameter jsonArray
     */
    abstract filterByValueAndLimit(key: string, value: string, limit: number, func: Function): void;

    abstract getInnerObject():any;

    abstract setInnerObject(o:any):void;

}