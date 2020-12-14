import { Component, NgZone, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RunningService } from "src/app/services/running.service";
import { Observable } from "rxjs";
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { MapboxService, Feature } from "src/app/services/mapbox.service";
import * as firebase from "firebase";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { MainServiceService } from "src/app/services/main-service.service";

@Component({
  selector: "app-add-club",
  templateUrl: "./add-club.page.html",
  styleUrls: ["./add-club.page.scss"],
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

  clubForm: FormGroup;

  userr: any;
  map: any;

  urlPath = {
    photoURL: "",
    userID: this.mainService.user.uid,
  };

  task: any;
  minTime = "";
  constructor(
    private mapboxService: MapboxService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    public mainService: MainServiceService,
    public alertCtrl: AlertController,
    public zone: NgZone
  ) {}
  ngOnInit() {
    const time = new Date();
    this.minTime = time.toDateString();
    this.clubForm = this.fb.group({
      name: [
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.maxLength(30),
          Validators.required,
        ]),
      ],
      address: ["", Validators.required],
      openingHours: ["", Validators.required],
      closingHours: ["", Validators.required],
    });
  }
  ionViewDidEnter() {}
  async addClub(formData) {
    const clubData = { ...formData, ...this.urlPath };
    if (!this.urlPath.photoURL) {
      const alerter = await this.alertCtrl.create({
        header: 'No Image',
        message: "There is no image for the Club. Continue?",
        buttons: [
          {
            text: "Continue",
            handler: () => {
              this.mainService.createClub(clubData).then((res) => {
                this.navCtrl.navigateBack("tabs/add");
              });
            },
          },
          {
            text: "No",
            role: "cancel",
          },
        ],
      });
      await alerter.present()
    } else {
      this.mainService.createClub(clubData).then((res) => {
        this.navCtrl.navigateBack("tabs/add");
      });
    }

  }

  uploadClubPic(event) {
    this.zone.run(() => {
      this.uploading = true;
      const file = event.target.files[0];
      // File or Blob named mountains.jpg
      console.log(event, file);
      
      // Create the file metadata
   
  
      // Upload file and metadata to the object 'images/mountains.jpg'
      const uploadTask = this.storageRef
        .child("images/" + file.name)
        .put(file);
  
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  
            this.progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  
        },
        (error) => {
          console.log(error);
          
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.urlPath.photoURL = downloadURL;
            this.uploading = false;
            this.progress = 0;
            console.log(this.urlPath.photoURL);
            
          });
        }
      );
    })
  }
  // >>>>
  file(filePath: any, file: any): any {
    throw new Error("Method not implemented.");
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

    this.userr = this.selectedAddress;
    this.addresses = [];
    // this.addresses=[];
  }
  back() {
    this.navCtrl.navigateBack('tabs/add')
  }
}
