import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { stringify } from 'querystring';

@Injectable()
export class AppService {
  url: string;
  urlOpenStreet: string;
  key: string;
  include: string;
  constructor(private http: Http) {
    this.urlOpenStreet = 'https://nominatim.openstreetmap.org';
    this.url = 'http://dev.virtualearth.net/REST/v1/Autosuggest';
    this.key = 'key=AgvNyUv2HxHoSrAFetCqig-cxnOAHre9ABFkXa6cY7WFYsk5WtY95whUlvwd10Mh';
    this.include = '&cf=GB';
  }

  openstreet_search(term) {
    let postalcodeUrl = this.urlOpenStreet + '/search?q=' + term;
    postalcodeUrl += '&format=json&addressdetails=1&countrycodes=gb';
    return this.http.get(postalcodeUrl).pipe(map(res => {
      return res.json();
    }));
  }

  openstreet_details(lat, lon) {
    let postalcodeUrl = this.urlOpenStreet + '/reverse?lat=' + lat + '&lon=' + lon;
    postalcodeUrl += '&format=json';
    return this.http.get(postalcodeUrl).pipe(map(res => {
      return res.json();
    }));
  }

  kabbee_price(data) {
    const postalcodeUrl = 'https://quotingtest.api.kabbee.com/UnAuthQuotes/Full';
    return this.http.post(postalcodeUrl, data).pipe(map(res => {
      return res.json();
    }));
  }

  search_word(term) {
    let postalcodeUrl = this.url + '?q=' + term;
    postalcodeUrl += this.include + '&' + this.key;
    return this.http.get(postalcodeUrl).pipe(map(res => {
      return res.json().resourceSets.map(item => {
        const d = item.resources[0].value.map(response => {
          return response.address.formattedAddress;
          });
        return d;
        });
    }));
  }

  search_address(lat, lon) {
    let postalcodeUrl = this.url + '/' + lat + ',' + lon;
    postalcodeUrl += '?' + this.key + this.include;
    return this.http.get(postalcodeUrl).pipe(map(res => {
      return res.json().resourceSets.map(item => {
        return item.resources.map(address => {
          console.log('address', address);
          return address.name;
        });
      });
    }));
  }
}
