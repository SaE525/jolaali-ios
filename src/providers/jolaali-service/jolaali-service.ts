import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import 'rxjs/add/operator/map'
/*
  Generated class for the JolaaliServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let jolaaliUrl = 'http://52.1.53.136/musicmobileapp/';
@Injectable()
export class JolaaliServiceProvider {

  constructor(public http: Http) {
    console.log('Hello JolaaliServiceProvider Provider');
  }
  jolaaliservice(suburl)
  {
    var full_url = jolaaliUrl+suburl;
    return this.http.get(full_url).map(res=>res.json());
  }
}
