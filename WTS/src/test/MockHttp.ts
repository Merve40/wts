import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class MockHttp extends Http {

    _url: string;

    get url(): string {
        return this._url;
    }

    get(url: string): Observable<any> {
        this._url = url;
        var response = new MockResponse(url);
        return Observable.of(response);
    }

    post(url: string, body: any): Observable<any> {
        this._url = url;
        var response = new MockResponse(JSON.stringify(body));
        return Observable.of(response);
    }

    put(url: string, body: any): Observable<any> {
        this._url = url;
        var response = new MockResponse(JSON.stringify(body));
        return Observable.of(response);
    }

    delete(url: string, id:any): Observable<any>{
        this._url = url;
        var response = new MockResponse(new String(id));
        return Observable.of(response);
    }
}

export class MockResponse {

    _response: String;

    constructor(response:String){
        this._response = response;
    }

    text(): String {
        return this._response;
    }

}