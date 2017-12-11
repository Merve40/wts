import { Http } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { Base } from './base';

/**
 * Service class for handling Server Requests.
 * This class has basic / generic functions, which can be used in any Table-Class.
 */
@Injectable()
export class Api {
    url: string = "https://worktostudents.firebaseio.com/";
    suffix: string = ".json?";
    orderBy = "orderBy=";
    equalTo = "equalTo=";
    limitTo = "limitToFirst=";
    and = "&";
    quote = "\"";
    endAt = "endAt=";
    restStirng = "\uff8f";

    constructor( @Inject(Http) public http: Http) {
    }

    /**
     * Deletes an entry from the database.
     * 
     * @param base Class representing the table
     * @param id id of the entry
     * @param source query source
     * @param func callback function to be called once the result is returned from the server
     * @param src source class to use the 'this' identifier within the callback function
     */
    public delete(base: Base, id: string, source: string, func: Function, src: any): void {
        if(!id || id.trim().length == 0){
            return;
        }
        let tbl = base.table.toString();
        let _url = this.url.concat(tbl).concat("/").concat(id)
            .concat(".json");

        let response = this.http.delete(_url);
        response.forEach(obj => {
            var json = JSON.parse(obj.text());
            func.apply(src, [source, json]);
            return obj;
        });
    }

    /**
     * Updates an entry in the database.
     * 
     * @param base Class representing the table
     * @param id unique id of the entry to update
     * @param body content of the entry
     * @param source query source
     * @param func callback function to be called once the result is returned from the server
     * @param src source class to use the 'this' identifier within the callback function
     */
    public put<T extends Base>(base: T, id: string, body: any, source: string, func: Function, src: any): void {
        let tbl = base.table.toString();
        let _url = this.url.concat(tbl).concat("/").concat(id)
            .concat(".json");

        let response = this.http.put(_url, body);
        response.forEach(obj => {
            var json = JSON.parse(obj.text());
            func.apply(src, [source, json]);
            return obj;
        });
    }

    /**
     * Creates a new entry in the database.
     * 
     * @param base Class representing table
     * @param obj content of the entry to create
     * @param source query source
     * @param func callback function to be called once the result is returned from the server
     * @param src source class to use the 'this' identifier within the callback function
     */
    public post<T>(base: Base, obj: T, source: string, func: Function, src: any): void {
        let tbl = base.table.toString();
        let _url = this.url.concat(tbl).concat(this.suffix);
        let body = JSON.stringify(obj);

        let response = this.http.post(_url, body);
        response.forEach(_obj => {
            var json = JSON.parse(_obj.text());
            func.apply(src, [source, json]);
            return _obj;
        });
    }

    /**
     * Retrieves an entry by it's unique id.
     * 
     * @param base Class representing the Table
     * @param id unique id
     * @param source query source
     * @param func callback function to be called once the result is returned from the server
     * @param src source class to use the 'this' identifier within the callback function
     */
    public get(base: Base, id: string, source: string, func: Function, src: any): void {
        this.getByTable(base.table, id, source, func, src);
    }

    /**
     * Generic method to retrieve an entry by a table.
     * 
     * @param tbl Table in the database
     * @param id unique id
     * @param source query source
     * @param func callback function to be called once the result is returned from the server
     * @param src source class to use the 'this' identifier within the callback function
     */
    public getByTable(tbl: string, id: string, source: string, func: Function, src: any): void {
        let _url = this.url.concat(tbl).concat("/").concat(id)
            .concat(".json");

        let response = this.http.get(_url);
        response.forEach(obj => {
            var json = JSON.parse(obj.text());
            func.apply(src, [source, { id: id, body: json }]);
            return json;
        });
    }

    /**
     * Retrieves an entry by comparing a specific field with a value.
     * 
     * @param base Class representing the Table
     * @param key field of an entry
     * @param value value of the specified field
     * @param source query source
     * @param func callback function to be called once the result is returned from the server
     * @param src source class to use the 'this' identifier within the callback function
     */
    public getByValue(base: Base, key: string, value: string, source: string, func: Function, src: any): void {
        this.getByValueWithTable(base.table, key, value, source, func, src);
    }

    /**
     * Retrieves an entry by comparing a specific field with a value an a specified table.
     * 
     * @param tbl Table in the database
     * @param key field of an entry
     * @param value value of the sepcified field
     * @param source query source
     * @param func callback function to be called once the result is returned from the server
     * @param src source class to use the 'this' identifier within the callback function
     */
    public getByValueWithTable(tbl: string, key: string, value: string, source: string, func: Function, src: any): void {
        let _url = this.url.concat(tbl).concat(this.suffix)
            .concat(this.orderBy)
            .concat(this.quote).concat(key).concat(this.quote)
            .concat(this.and)
            .concat(this.equalTo)
            .concat(this.quote).concat(value).concat(this.quote)
            .concat(this.and)
            .concat(this.limitTo).concat("1");

        let response = this.http.get(_url);
        response.forEach(obj => {
            var innerJson = this.getInnerJson(obj.text());
            func.apply(src, [source, innerJson]);
            return obj;
        });
    }

    /**
     * Retrieves a list of entries by comparing a field with a given value.
     * 
     * @param base Class representing the Table
     * @param key field of an entry
     * @param value value of the specied fiels
     * @param source query source
     * @param func callback function to be called once the result is returned from the server
     * @param src source class to use the 'this' identifier within the callback function
     */
    public filterByValue(base: Base, key: string, value: string, source: string, func: Function, src: any): void {
        let tbl = base.table.toString();
        let _url = this.url.concat(tbl).concat(this.suffix).concat(this.orderBy)
            .concat(this.quote).concat(key).concat(this.quote)
            .concat(this.and)
            .concat(this.equalTo)
            .concat(this.quote).concat(value).concat(this.quote)
            .concat(this.and);

        let response = this.http.get(_url);
        response.forEach(obj => {
            var innerJson = this.getInnerJsonArray(obj.text());
            func.apply(src, [source, innerJson]);
            return obj;
        });
    }

    /**
     * Retrieves entries by comparing a field with a value, but limiting the amount of results.
     * 
     * @param base Class representing the Table
     * @param key field of an entry
     * @param value value of the specified field
     * @param limit maximum amount of entries to be returned
     * @param source query source
     * @param func callback function to be called once the result is returned from the server
     * @param src source class to use the 'this' identifier within the callback function
     */
    public filterByValueAndLimit(base: Base, key: string, value: string, limit: number,
        source: string, func: Function, src: any): void {
        let tbl = base.table.toString();
        let _url = this.url.concat(tbl).concat(this.suffix).concat(this.orderBy)
            .concat(this.quote).concat(key).concat(this.quote)
            .concat(this.and)
            .concat(this.equalTo)
            .concat(this.quote).concat(value).concat(this.quote)
            .concat(this.and)
            .concat(this.limitTo).concat("" + limit);

        let response = this.http.get(_url);
        response.forEach(obj => {
            var innerJson = this.getInnerJsonArray(obj.text());
            func.apply(src, [source, innerJson]);
            return obj;
        });
    }

    /**
     * Retrieves all entries within a table.
     * 
     * @param base Class representing the table.
     * @param source query source 
     * @param func callback function to be called once the result is returned from the server
     * @param src source class to use the 'this' identifier within the callback function
     */
    public getAll(base: Base, source: string, func: Function, src: any): void {
        let tbl = base.table.toString();
        let _url = this.url.concat(tbl).concat(this.suffix);

        let response = this.http.get(_url);
        response.forEach(obj => {
            var resp = this.getInnerJsonArray(obj.text());
            func.apply(src, [source, resp]);
            return obj;
        });
    }

    /**
     * Retrieves all entries whose specified field start with a regex.
     * 
     * @param base Class representing the Table
     * @param key field of an entry
     * @param value value of the specified field
     * @param source query source
     * @param func callback function to be called once the result is returned from the server
     * @param src source class to use the 'this' identifier within the callback function
     */
    public startsWith(base: Base, key: string, value: string, source: string, func: Function, src: any): void {
        let tbl = base.table.toString();
        let _url = this.url.concat(tbl).concat(this.suffix)
            .concat(this.orderBy)
            .concat(this.quote).concat(key).concat(this.quote)
            .concat(this.and)
            .concat(this.endAt)
            .concat(this.quote).concat(value).concat(this.restStirng).concat(this.quote);

        var response = this.http.get(_url);
        response.forEach(obj => {
            var res = this.getInnerJsonArray(obj.text());
            func.apply(src, [source, res]);
            return obj;
        });
    }

    /**
     * Retrives all entries whose specified field contains an expression.
     * 
     * @param base Class representing the Table
     * @param key field of an entry
     * @param value value of the specified field
     * @param source query source
     * @param func callback function to be called once the result is returned from the server
     * @param src source class to use the 'this' identifier within the callback function
     */
    getByContains(base: Base, key: string, value: string, source: string, func: Function, src: any): void {
        let _url = "https://us-central1-worktostudents.cloudfunctions.net/contains";
        var body = {
            tbl: base.table,
            key: key,
            value: value
        }
        var response = this.http.post(_url, body);
        response.forEach(obj => {
            var json = JSON.parse(obj.text());
            func.apply(src, [source, json]);
            return obj;
        });
    }

    /**
     * Retrieves all entries that are compared to a given field & value and are sorted by a given field.
     *  
     * @param body body = {     tbl,
     *                          key,
     *                          value,
     *                          sortKey,
     *                          startAt,
     *                          ascending,
     *                          limit
     *                      }
     * @param flag query source
     * @param func callback function to be called once the result is returned from the server
     * @param src source class to use the 'this' identifier within the callback function
     */
    getByKeyValueSortedBy(body:any, flag:string, func:Function, src:any):void{
        var _url = "https://us-central1-worktostudents.cloudfunctions.net/sortBy";
        var response = this.http.post(_url, body); 
        response.forEach((obj)=>{
            var json = JSON.parse(obj.text());
            func.apply(src, [flag, json]);
            return obj;
        });
    }

    /**
     * Retrieves the object with it'S id and returns the inner body.
     * @param json 
     */
    private getInnerJson(json: string): any {
        var _id = this.getJsonId(json);
        var removeOuter = json.substr(1, json.length);
        var start = removeOuter.indexOf("{") + 1;
        var end = removeOuter.lastIndexOf("}") + 1;

        var substr = json.substr(start, (end - start));

        if (substr.length > 1) {
            var _body = JSON.parse(substr);
            return { id: _id, body: _body };
        } else {
            return { id: "", body: null };
        }
    }

    private getInnerJsonArray(jarray: string) {
        var removeOuter = jarray.substr(1, jarray.length - 2);
        var replaced = removeOuter.split("},").join("} , ");

        var arr = replaced.split(" , ");
        var innerArr = [];

        for (var i = 0; i < arr.length; i++) {
            arr[i] = "{" + arr[i] + "}";
            var json = this.getInnerJson(arr[i]);

            innerArr.push(json);
        }
        return innerArr;

    }

    private getJsonId(json: string): string {
        var replaced = json.split("{").join(" ")
            .split("}").join(" ")
            .split(":").join(" ")
            .split("\"").join(" ")
            .split(",").join(" ")
            .trim();
        var id = replaced.split(" ")[0].trim();
        return id;
    }

}