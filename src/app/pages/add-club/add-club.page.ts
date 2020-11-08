import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RunningService } from 'src/app/services/running.service';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { MapboxService,Feature } from 'src/app/services/mapbox.service';
import * as firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-add-club',
  templateUrl: './add-club.page.html',
  styleUrls: ['./add-club.page.scss'],
})
export class AddClubPage implements OnInit {
 // map
 list:any;
 addresses:string[]=[];
 selectedAddress=null;
 coordinates;
 lat;
 lng;
 userZ : any;

  user = {} as User;
  public clubForm: FormGroup;
  RegisterForm: string = "true";
  UpdateForm: string = "false";
  selectedFile = null;
  
  userr : any;
  map: any;

  itemList;
  marker?: any;
  startPosition;

  uid: any;
 
  uploadPercent: number;
  downloadU: any;
  uniqkey: any;



  urlPath = '';
 

  newName;
  newAddress;
  newOpeningHours;
  newClosingHours;

  photoURL: string;
  
  club;
  Address;
  close;
  Hours;
  fileRef: any;
  task: any;
  

  constructor( private storage: AngularFireStorage,private mapboxService:MapboxService,private fb: FormBuilder,private clubService:RunningService) 
  { 
     

    this.clubForm = fb.group({

      newName: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30), Validators.required])],
      newAddress: ['', Validators.required],
      // pic: ['', Validators.required],
      newOpeningHours: ['', Validators.required],
      newClosingHours: ['', Validators.required],
     


    },
    );
  }

  addClub(newName, newAddress, newOpeningHours, newClosingHours) 
  {
       this.newName = this.clubForm.get('newName').value
       this.newAddress = this.clubForm.get('newAddress').value
       this.newOpeningHours = this.clubForm.get('newOpeningHours').value   
       
       this.newClosingHours = this.clubForm.get('newClosingHours').value


    this.clubService.addClub(this.newName,this.newAddress,this.newOpeningHours,this.newClosingHours)
 
  }

  uploadClubPic(event){
    this.clubService.uploadClubPic(event)
    
    //
    this.file = event.target.files[0];
    this.uniqkey = this.newName + 'Logo';
    const filePath = this.uniqkey;
    this.fileRef = this.storage.ref(filePath);
    this.task = this.storage.upload(filePath, this.file);
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadU = this.fileRef.getDownloadURL().subscribe(urlPath => {
          console.log(urlPath);

          this.urlPath=urlPath
          console.log(this.urlPath,"fighter");
          
        });
      })
    ).subscribe();
  }
  file(filePath: any, file: any): any {
    throw new Error("Method not implemented.");
    //
    // this.presentLoading();
  }

  ngOnInit() {
    // if (this.UpdateForm == "true") {
     
    // }
  }
  ionViewDidEnter() {
    if (this.UpdateForm == "true") {
    
    }

  }
//adress
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
   this.userr= this.selectedAddress;
   console.log(this.user)
   this.addresses = [];
  // this.addresses=[];
}
//address



}
