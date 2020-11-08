import { Component, OnInit } from '@angular/core';
import { MapboxService,Feature } from 'src/app/services/mapbox.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  constructor( private mapboxService:MapboxService) { }
  list:any;
  addresses:string[]=[];
  selectedAddress=null;
  coordinates;
  lat;
  lng;
  user : any;
search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxService.search_word(searchTerm)
        .subscribe((features: Feature[]) => {
          this.coordinates = features.map(feat => feat.geometry)
          this.addresses = features.map(feat => feat.place_name)
          this.list = features;
          console.log(this.list)
        });
    } else {
      this.addresses = [];
    }
  }
  onSelect(address:string,i){
    this.selectedAddress=address;
     //  selectedcoodinates=
     console.log("lng:" + JSON.stringify(this.list[i].geometry.coordinates[0]))
     console.log("lat:" + JSON.stringify(this.list[i].geometry.coordinates[1]))
     this.lng = JSON.stringify(this.list[i].geometry.coordinates[0])
     this.lat = JSON.stringify(this.list[i].geometry.coordinates[1])
    //  this.user.coords = [this.lng,this.lat];
     console.log("index =" + i)
     console.log(this.selectedAddress)
     this.user= this.selectedAddress;
     console.log(this.user)
      this.addresses = [];
    // this.addresses=[];
  }
  ngOnInit() {
  }
}
