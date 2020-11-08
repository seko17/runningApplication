import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { RunningService } from 'src/app/services/running.service';
import { MapboxService,Feature } from 'src/app/services/mapbox.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  objectA={
    name:'',
    email:'',
  price:'',
  type:'',
  key:''
  }
  users: any;
  defaultpic=true
  theUser=[];
  currentuser: string;
  private MUsers: AngularFirestoreDocument
  sub
  username: string;
  photoURL: string;
  uploadPercent: number;
  thegender: string;
  theKey;
  theEmail;
  email;
  nn:string="";
  tempUser:string="";
  addresses:string[]=[];
  selectedAddress=null;
  coordinates;
  lat;
  lng;
  user : any;
  list:any;
  private uid: string= null;
  downloadU: any;
  uniqkey: string;
  fileRef: any;
  task: any;
  urlPath: any;
 aname 

  constructor(
    private storage: AngularFireStorage,
    private authService: AuthService,
    public afs:AngularFirestore,
    private altctrl: AlertController,
    public afAuth: AngularFireAuth,
    private router: Router,
    public runn: RunningService,
    public loadingController: LoadingController,
    private mapboxService:MapboxService
  ) { 
    this.theUser=[]    
    this.getdata()

  }

  ngOnInit() {
    
  }
  
//address
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
  //  this.addresses = [];
  // this.addresses=[];
}
//address

  uploadProfilePic(event){
    this.runn.uploadProfilePic(event)
   //
   this.file = event.target.files[0];
         
   this.uniqkey = this.aname + 'Logo';
   const filePath = this.uniqkey;
   this.fileRef = this.storage.ref(filePath);
   this.task = this.storage.upload(filePath, this.file);
   this.task.snapshotChanges().pipe(
     finalize(() => {
       this.downloadU = this.fileRef.getDownloadURL().subscribe(urlPath => {
         console.log(urlPath);

         this.photoURL=urlPath
         console.log(this.urlPath,"fighter");
         
       });
     })
   ).subscribe();
 }
 file(filePath: any, file: any): any {
   throw new Error("Method not implemented.");
   //
  //  this.filepresentLoading();
  }

  getdata()
  {
    return new Promise((resolve, reject) => {
      this.runn.rtUsers().then(data =>{
     
        console.log( data.length);
        for( let x = 0; x < data.length; x++ )
        {
         console.log(x);

         this.uid = data[0].userKey;
         
        this.theUser.push({ 
          userKey:  data[x].userKey,
          name:  data[x].name,
          address:  data[x].address,
          age:  data[x].age,
          email:  data[x].email,
          gender:  data[x].gender,
          photoURL:data[x].photoURL
        }
          
          )
        }
        this.aname =this.theUser[0].name
        this.email=this.theUser[0].Email
        this.photoURL=this.theUser[0].photoURL
      console.log(this.theUser,"the LAST ONE vele" )
           if(this.theUser[0].photoURL==null)
           {
              this.defaultpic=false;
            
           }
     })
    }
    )
  
  }
  async nameUpdate(user) {

    
    const alert = await this.altctrl.create({
      subHeader: 'Add/Edit Name',
      inputs: [
        {
          name: 'displayName',
          type: 'text',
          // value: this.theUser[0].displayName,
          placeholder: 'displayName'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (inputData) => {
            this.nn=inputData.displayName;

            // this.tempUser=this.theUser[0]
            console.log(this.nn+"ddfdddfdfdd",user)
            this.runn.updateName(this.uid,this.nn)
            this.presentLoading();


          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();

  }

  // 
  async AgeUpdate(user) {

    
    const alert = await this.altctrl.create({
      subHeader: 'Add/Edit Name',
      inputs: [
        {
          name: 'displayName',
          type: 'number',
          // value: this.theUser[0].displayName,
          placeholder: 'Age'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (inputData) => {
            this.nn=inputData.displayName;

            // this.tempUser=this.theUser[0]
            console.log(this.nn+"ddfdddfdfdd",user)
            this.runn.updateAge(this.uid,this.nn)
            this.presentLoading();


          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();

  }

  // 
  async AddressUpdate(user) {

    
    const alert = await this.altctrl.create({
      subHeader: 'Add/Edit Name',
      inputs: [
        {
          name: 'displayName',
          type: 'text',
          // value: this.theUser[0].displayName,
          placeholder: 'Address'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (inputData) => {
            this.nn=inputData.displayName;

            // this.tempUser=this.theUser[0]
            console.log(this.nn+"ddfdddfdfdd",user)
            this.runn.updateAddress(this.uid,this.nn)
            this.presentLoading();


          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();

  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'loading...',
      duration: 4000
    });
    await loading.present();
    this.getdata()
    loading.dismiss()
  }
 
  async filepresentLoading() {
    const loading = await this.loadingController.create({
      message: 'loading...',
      duration: 15000
    });
    await loading.present();
    // this. getdata()
    loading.dismiss()
  }
}
