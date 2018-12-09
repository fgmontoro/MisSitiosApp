import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: GoogleMap;
  topics = [];
  name: string;
  talks = [];
  preparedTags = [
    '#Ionic',
    '#Angular',
    '#Javascript',
    '#Mobile',
    '#Hybrid',
    '#CrossPlatform'
  ];
  site = {
    url: ['d','f'],
    description: 'Java Technology - Spring Framework'
  };
  position: any;

  constructor(private navCtrl: NavController, private googleMaps: GoogleMaps, public db: AngularFireDatabase) {
    //this.db.list('sitios').push(this.site); 
  }

  ionViewDidLoad(){
    this.loadMap();
  }

  addTalk() {
    this.talks.push({name: this.name, topics: this.topics});
    let reg =  {
      position: this.position,
      tags : this.topics
    };
    this.db.list('sitios').push(reg);
  }

  loadMap(){

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904, // default location
          lng: -89.3809802 // default location
        },
        zoom: 18,
        tilt: 30
      }
    };
  
    this.map = GoogleMaps.create('map_canvas', mapOptions);
  
    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      // Now you can use all methods safely.
      this.getPosition();
      this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
          (data) => {
            this.map.clear();
            this.position = data[0];
            this.map.addMarker({
              title: 'My Position',
              icon: 'blue',
              animation: 'DROP',
              position: data[0]
            });
          }
      );
    })
    .catch(error =>{
      console.log(error);
    });
  
  }

  addMarker(data): void {
    this.map.clear();
    this.map.addMarker({
      title: 'My Position',
      icon: 'blue',
      animation: 'DROP',
      position: data.latLng
    });
  }

  getPosition(): void{
    this.map.getMyLocation()
    .then(response => {
      this.map.moveCamera({
        target: response.latLng
      });
      this.map.addMarker({
        title: 'My Position',
        icon: 'blue',
        animation: 'DROP',
        position: response.latLng
      });
    })
    .catch(error =>{
      console.log(error);
    });
  }

}
