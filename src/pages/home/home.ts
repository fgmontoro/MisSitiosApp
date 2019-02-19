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
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs-compat';
import { map } from 'rxjs-compat/operators';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  /*--------------------------------------------*/
  addItem(newName: string) {
    this.itemsRef.push({ text: newName });
  }
  updateItem(key: string, newText: string) {
    this.itemsRef.update(key, { text: newText });
  }
  deleteItem(key: string) {
    this.itemsRef.remove(key);
  }
  deleteEverything() {
    this.itemsRef.remove();
  }
  /*--------------------------------------------*/
  map: GoogleMap;
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
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
  markers:Observable<any>;

  constructor(private navCtrl: NavController, private googleMaps: GoogleMaps, public db: AngularFireDatabase) {
    this.itemsRef = db.list('sitios');
    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  ionViewDidLoad(){
    // this.loadMap();
    //this.markers = this.db.list('sitios').valueChanges();
  }

  showDatabase() {
    //this.markers = this.db.list('sitios').valueChanges();
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
