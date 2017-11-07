export abstract class Base {

    public table: string;
    public srcClass:any;

    constructor(table: string) {
        this.table = table;
    }

    /**
     * Deletes an object by the given id.
     * 
     * @param id primary key
     * @param source flag
     * @param func callback
     */
    abstract delete(id:string, source:string, func:Function):void;

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
    abstract push<T>(t: T, source:string,  func: Function):void;

    /**
     * Retrieves the object by it's id.
     * 
     * @param base Base
     * @param id push id
     * @param func callback function => param json
     */
    abstract getById(id: string, source:string,  func: Function): void;

    /**
     * Retrieves a row by key and value.
     * 
     * @param base Base 
     * @param key Column
     * @param value Value
     * @param func callback function => parameter is json
     */
    abstract getByValue(key: string, value, source:string,  func: Function): void;

    /**
     * Filters a List for a key and value.
     * 
     * @param base Base
     * @param key Column
     * @param value Value
     * @param func callback function => parameter is jsonArray
     */
    abstract filterByValue(key: string, value: string, source:string, func: Function): void;

    /**
     * Filters a List by Key-Value and Limits the number of results.
     * 
     * @param base Base
     * @param key Column
     * @param value Value
     * @param limit max result number
     * @param func callback function => parameter jsonArray
     */
    abstract filterByValueAndLimit(key: string, value: string, limit: number, source:string, func: Function): void;

    /**
     * Retrieves all entries in one table.
     * 
     * @param source flag 
     * @param func callback
     */
    abstract getAll( source:string, func:Function):void;

    /**
     * Get all entries starting with a prefix of a specific field.
     * 
     * @param key field 
     * @param value prefix (not case sensitive)
     * @param source flag
     * @param func callback function => parameter jsonArray
     */
    abstract getAllStartingWith(key:string, value:string, source:string, func:Function):void;

    /**
     * Get all entries that contain a string of a specific field.
     * 
     * @param key field 
     * @param value string / value
     * @param source flag
     * @param func callback function => parameter jsonArray
     */
    abstract getAllContaining(key:string, value:string, source:string, func:Function):void;

    public setSrcClass(srcClass:any):void{
        this.srcClass = srcClass;
    }
}