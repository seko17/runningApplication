import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
export interface MapboxOutput {
  attribute: string;
  features: Feature[];
  geometry: Geometry[];
  query: [];
}
export interface Feature {
  geometry: any;
  place_name: string;
}
export interface Geometry {
  coordinates: string;
}
@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  constructor(private http: HttpClient) {
  }
  search_word(query: string) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    // tslint:disable-next-line: max-line-length
    return this.http.get(url + query + '.json?type=address&access_token=pk.eyJ1Ijoic3VjY2VzcyIsImEiOiJjanhxMjNxemkwbTJyM2NwOWwxeG1tbGZjIn0.bDNdundlCIPQcFAc5MAqJg')
    .pipe(map((res: MapboxOutput) => {
      return res.features;
    }));
  }
}
