import { Component, NgZone, OnInit } from '@angular/core';
import {
  AngularFirestoreDocument,
  AngularFirestore,
} from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { RunningService } from 'src/app/services/running.service';
import { MapboxService, Feature } from 'src/app/services/mapbox.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import * as firebase from 'firebase';
import { MainServiceService } from 'src/app/services/main-service.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  db = firebase.firestore();
  storageRef = firebase.storage().ref();
  firebaseUser = firebase.auth().currentUser;
  minTime = '';
  objectA = {
    name: '',
    email: '',
    price: '',
    type: '',
    key: '',
  };
  users: any;
  defaultpic = true;
  theUser = [];
  tusr = [];
  loggedInUser: any = {};

  currentuser: string;
  private MUsers: AngularFirestoreDocument;
  sub;
  username: string;
  photoURL: string;
  uploadPercent: number;
  thegender: string;
  theKey;
  theEmail;
  email;
  nn: string = '';
  tempUser: string = '';
  addresses: string[] = [];
  selectedAddress = null;
  coordinates;
  lat;
  lng;
  user: any;
  list: any;
  private uid: string = null;
  downloadU: any;
  uniqkey: string;
  fileRef: any;
  task: any;
  uploading = false;
  progress = 0;
  urlPath: any;
  aname;

  constructor(
    private authService: AuthService,
    public afs: AngularFirestore,
    private altctrl: AlertController,
    public afAuth: AngularFireAuth,
    private router: Router,
    public runn: RunningService,
    public loadingController: LoadingController,
    private mapboxService: MapboxService,
    private zone: NgZone,
    private toastCtrl: ToastController,
    public mainService: MainServiceService,
  ) {
    // this.theUser = [];
    this.getdata();
  }

  ngOnInit() {}

  //address
  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxService
        .search_word(searchTerm)
        .subscribe((features: Feature[]) => {
          this.coordinates = features.map((feat) => feat.geometry);
          this.addresses = features.map((feat) => feat.place_name);
          this.list = features;
          console.log(this.list);
        });
    } else {
      this.addresses = [];
    }
  }
  onSelect(address: string, i) {
    this.selectedAddress = address;
    //  selectedcoodinates=
    console.log('lng:' + JSON.stringify(this.list[i].geometry.coordinates[0]));
    console.log('lat:' + JSON.stringify(this.list[i].geometry.coordinates[1]));
    this.lng = JSON.stringify(this.list[i].geometry.coordinates[0]);
    this.lat = JSON.stringify(this.list[i].geometry.coordinates[1]);
    //  this.user.coords = [this.lng,this.lat];
    console.log('index =' + i);
    console.log(this.selectedAddress);
    this.user = this.selectedAddress;
    console.log(this.user);
    //  this.addresses = [];
    // this.addresses=[];
  }
  //address

  uploadProfilePic(event) {
    const file = event.target.files[0];
    console.log(file);

    // File or Blob named mountains.jpg

    // Create the file metadata
    const metadata = {
      contentType: 'image/jpeg',
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const uploadTask = this.storageRef
      .child('images/' + file.name)
      .put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(this.progress);
        
        if (this.progress < 90) {
          this.progress = 90;
        }
      },
      (error) => {},
      () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.progress = 100;
          this.urlPath = downloadURL;
          this.db
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .update({
              photoURL: downloadURL,
            })
            .then(() => {
              this.uploading = false;
              this.progress = 0;
              this.getdata();
            })
            .catch(async (err) => {
              let alerter = await this.altctrl.create({
                header: 'Image Upload Error',
                message: 'Something went wrong with uploading an image',
                buttons: ['Okay'],
              });
              await alerter.present();
            });
        });
      }
    );
  }

  file(filePath: any, file: any): any {
    throw new Error('Method not implemented.');
    //
    //  this.filepresentLoading();
  }

  async getdata() {
    this.zone.run(async () => {
      const loader = await this.loadingController.create({
        message: 'Getting Profile. Please wait...',
      });
      await loader.present();
      this.mainService.getUserProfile().then(res => {
        this.loggedInUser = res;
        setTimeout(async () => {
          await loader.dismiss();
        }, 1000);
      });
    });
  }
  async nameUpdate(user) {
    const alert = await this.altctrl.create({
      header: 'Update Display Name',
      inputs: [
        {
          name: 'displayName',
          type: 'text',
          // value: this.theUser[0].displayName,
          placeholder: 'Display Name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Ok',
          handler: (inputData) => {
            this.nn = inputData.displayName;

            // this.tempUser=this.theUser[0]
            console.log(this.nn + 'ddfdddfdfdd', user);
            this.runn.updateName(this.firebaseUser.uid, this.nn);
            this.presentLoading();
          },
        },
      ],
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }

  //
  async AgeUpdate(user) {
    const alert = await this.altctrl.create({
      header: 'Update Age',
      inputs: [
        {
          name: 'age',
          type: 'number',
          // value: this.theUser[0].displayName,
          placeholder: 'Age',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Ok',
          handler: (inputData) => {
            this.nn = inputData.age;

            // this.tempUser=this.theUser[0]
            console.log(this.nn + 'ddfdddfdfdd', user);
            this.runn.updateAge(this.firebaseUser.uid, this.nn);
            this.presentLoading();
          },
        },
      ],
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }
  async emailUpdate() {
    let alerter = await this.altctrl.create({
      header: 'Update Email',
      inputs: [
        {
          placeholder: 'New Email',
          type: 'email',
          name: 'email',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Update',
          handler: (data) => {
            this.presentLoading();
            this.db
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              .update({
                Email: data.email,
              })
              .then(async (res) => {
                await this.loadingController.dismiss();
                const toaster = await this.toastCtrl.create({
                  message: 'Update Successful.',
                  duration: 3000,
                });
                await toaster.present();
              });
          },
        },
      ],
    });
    await alerter.present();
  }
  //
  async AddressUpdate(user) {
    const alert = await this.altctrl.create({
      header: 'Update Address',
      inputs: [
        {
          name: 'displayName',
          type: 'text',
          // value: this.theUser[0].displayName,
          placeholder: 'New Address',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Ok',
          handler: (inputData) => {
            this.nn = inputData.displayName;
            // this.tempUser=this.theUser[0]
            console.log(this.nn + 'ddfdddfdfdd', user);
            this.runn.updateAddress(this.firebaseUser.uid, this.nn);
            this.presentLoading();
          },
        },
      ],
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please Wait...',
      duration: 4000,
    });
    await loading.present();
    this.getdata();
    loading.dismiss();
  }

  async filepresentLoading() {
    const loading = await this.loadingController.create({
      message: 'loading...',
      duration: 15000,
    });
    await loading.present();
    // this. getdata()
    loading.dismiss();
  }
}
