import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RunningService } from 'src/app/services/running.service';
import { Observable } from 'rxjs';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { MapboxService, Feature } from 'src/app/services/mapbox.service';
import * as firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-club',
  templateUrl: './add-club.page.html',
  styleUrls: ['./add-club.page.scss'],
})
export class AddClubPage implements OnInit {
  db = firebase.firestore();
  storageRef = firebase.storage().ref();
  uploading = false;
  progress = 0;
  // map
  list: any;
  addresses: string[] = [];
  selectedAddress = null;
  coordinates;
  lat;
  lng;
  userZ: any;

  user = {} as User;
  clubForm: FormGroup;
  RegisterForm: string = 'true';
  UpdateForm: string = 'false';
  selectedFile = null;

  userr: any;
  map: any;

  itemList;
  marker?: any;
  startPosition;

  uid: any;

  uploadPercent: number;
  downloadU: any;
  uniqkey: any;

  urlPath = {
    photoURL: '',
    userID: firebase.auth().currentUser.uid,
  };

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
  minTime = '';
  constructor(
    private storage: AngularFireStorage,
    private mapboxService: MapboxService,
    private fb: FormBuilder,
    private runningService: RunningService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {}
  ngOnInit() {
    const time = new Date();
    this.minTime = time.toDateString();
    this.clubForm = this.fb.group({
      name: [
        '',
        Validators.compose([
          Validators.minLength(4),
          Validators.maxLength(30),
          Validators.required,
        ]),
      ],
      address: ['', Validators.required],
      openingHours: ['', Validators.required],
      closingHours: ['', Validators.required],
    });
  }
  ionViewDidEnter() {
    if (this.UpdateForm == 'true') {
    }
  }
  async addClub(formData) {
    let loader = await this.loadingCtrl.create({
      message: 'Adding Club. Please wait...'
    });
    await loader.present();
    const ad = { ...formData, ...this.urlPath };
    this.db
      .collection('clubs')
      .add(ad)
      .then(async (res) => {
        await loader.dismiss();
        const toaster = await this.toastCtrl.create({
          message: 'Club Created Successfully.',
          duration: 2000,
        });
        await toaster.present();
        setTimeout(() => {
          this.navCtrl.navigateBack('tabs/add');
        }, 1000);
      });
  }

  uploadClubPic(event) {
    this.uploading = true;
    const file = event.target.files[0];
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
        if (this.progress < 90) {
          this.progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        // switch (error.code) {
        //   case 'storage/unauthorized':
        //     // User doesn't have permission to access the object
        //     break;

        //   case 'storage/canceled':
        //     // User canceled the upload
        //     break;

        //   case 'storage/unknown':
        //     // Unknown error occurred, inspect error.serverResponse
        //     break;
        // }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.urlPath.photoURL = downloadURL;
          this.uploading = false;
          this.progress = 0;
          console.log('File available at', downloadURL);
        });
      }
    );
  }
  // >>>>
  file(filePath: any, file: any): any {
    throw new Error('Method not implemented.');
    //
    // this.presentLoading();
  }


  //adress
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
    this.lng = JSON.stringify(this.list[i].geometry.coordinates[0]);
    this.lat = JSON.stringify(this.list[i].geometry.coordinates[1]);
    //  this.user.coords = [this.lng,this.lat];
    this.userr = this.selectedAddress;
    this.addresses = [];
    // this.addresses=[];
  }
}
