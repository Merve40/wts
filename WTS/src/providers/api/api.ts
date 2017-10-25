import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable, Inject } from '@angular/core';

import { Base } from './base';

@Injectable()
export class Api {
    url: string = "https://worktostudents.firebaseio.com/";
    suffix: string = ".json?";
    orderBy = "orderBy=";
    equalTo = "equalTo=";
    limitTo = "limitToFirst=";
    and = "&";
    quote = "\"";
    whitespace = "%20";

    constructor( @Inject(Http) public http: Http) {
    }

    public delete<T extends Base>(base: T, func: Function): void {
        let tbl = base.table.toString();
        let _url = this.url.concat(tbl).concat("/").concat(base.id)
            .concat(".json");

        let response = this.http.delete(_url);
        response.forEach(obj => {
            var json = JSON.parse(obj.text());
            func.apply(this, [json]);
            return obj;
        });
    }

    public put<T extends Base>(base: T, func: Function): void {
        let tbl = base.table.toString();
        let _url = this.url.concat(tbl).concat("/").concat(base.id)
            .concat(".json");

        let response = this.http.put(_url, base.getInnerObject());
        response.forEach(obj => {
            var json = JSON.parse(obj.text());
            func.apply(this, [json]);
            return obj;
        });
    }

    public post<T>(base: Base, obj: T, func: Function): void {
        let tbl = base.table.toString();
        let _url = this.url.concat(tbl).concat(this.suffix);
        let body = JSON.stringify(obj);

        let response = this.http.post(_url, body);
        response.forEach(obj => {
            var json = JSON.parse(obj.text());
            func.apply(this, [json]);
            return json.name;
        });
    }

    public get<T extends Base>(base: T, value: string, func: Function): void {
        let tbl = base.table.toString();
        let _url = this.url.concat(tbl).concat("/").concat(value)
            .concat(".json");

        let response = this.http.get(_url);
        response.forEach(obj => {
            var json = JSON.parse(obj.text());
            func.apply(this, [json]);
            return json;
        });
    }

    public getByValue<T extends Base>(base: T, key: string, value: string, func: Function): void {
        let tbl = base.table.toString();
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
            func.apply(this, [innerJson]);
            return obj;
        })
    }

    public filterByValue<T extends Base>(base: T, key: string, value: string, func: Function): void {
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
            console.log(innerJson);
            func.apply(this, [innerJson]);
            return obj;
        })
    }

    public filterByValueAndLimit<T extends Base>(base: T, key: string, value: string, limit: number, func: Function): void {
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
            console.log(innerJson);
            func.apply(this, [innerJson]);
            return obj;
        })
    }

    /**
     * Retrieves the object with it'S id and returns the inner body.
     * @param json 
     */
    getInnerJson(json: string): any {
        var _id = this.getJsonId(json);
        var removeOuter = json.substr(1, json.length);
        var start = removeOuter.indexOf("{") + 1;
        var end = removeOuter.lastIndexOf("}") + 1;

        var _body = JSON.parse(json.substr(start, (end - start)));

        return {id: _id, body: _body};
    }

    getInnerJsonArray(jarray: string) {
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

    getJsonId(json: string): string {
        var replaced = json.split("{").join(" ")
                            .split("}").join(" ")
                            .split(":").join(" ")
                            .split("\"").join(" ")
                            .split(",").join(" ")
                            .trim();
        console.log(replaced);
        var id = replaced.split(" ")[0].trim();
        return id;
    }

}