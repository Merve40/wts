import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OnResultComplete } from '../../providers/api/OnResultComplete';
import { TranslateService } from '@ngx-translate/core';
import { MockProvider} from './dataprovider';


@Component({
  selector: 'list-search',
  templateUrl: 'list_search.html'
})
export class ListSearchPage implements OnResultComplete {

  items: string[];


  constructor(public mockProvider: MockProvider,public navCtrl: NavController,public translate: TranslateService) {
    this.items = mockProvider.getData();
  }

  onComplete(source, json) {
  }

  doInfinite() {
    /*this.mockProvider.getAsyncData().then((newData) => {
      for (var i = 0; i < newData.length; i++) {
        this.items.push(newData[i]);
      }

      infiniteScroll.complete();

      if (this.items.length > 90) {
        infiniteScroll.enable(false);
      }
    });*/
  }

}
