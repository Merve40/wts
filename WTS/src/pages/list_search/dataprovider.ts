import { Injectable } from '@angular/core';

@Injectable()
export class MockProvider {

  getData(): any[] {
    // return mock data synchronously
    let data: any[] = [];
    for (var i = 0; i < 20; i++) {
      data.push( this._getRandomData() );
    }
    return data;
  }

  getAsyncData(): Promise<any[]> {
    // async receive mock data
    return new Promise(resolve => {

      setTimeout(() => {
        resolve(this.getData());
      }, 1000);

    });
  }

  private _getRandomData() {
    let i = Math.floor( Math.random() * this._data.length );
    return this._data[i];
  }

  private _data = [
      "null",
      "zero",
      "empty",
  ];

}