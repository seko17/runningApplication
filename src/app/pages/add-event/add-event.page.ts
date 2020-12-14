import { Component, NgZone, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { RunningService } from "src/app/services/running.service";
import { AuthService } from "src/app/services/auth.service";
import { MapboxService, Feature } from "src/app/services/mapbox.service";
import { AlertController, LoadingController } from "@ionic/angular";
import { DatePipe } from "@angular/common";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { MainServiceService } from "src/app/services/main-service.service";
import { Router } from "@angular/router";
import * as firebase from "firebase";
@Component({
  selector: "app-add-event",
  templateUrl: "./add-event.page.html",
  styleUrls: ["./add-event.page.scss"],
  providers: [DatePipe],
})
export class AddEventPage implements OnInit {
  storageRef = firebase.storage().ref();
  users: any;
  defaultpic = true;
  theUser = [];
  photoURL: string;
  uploadPercent: number;
  currentuser: string;
  list: any;
  addresses: string[] = [];
  selectedAddress = null;
  coordinates;
  lat;
  lng;
  userr: any;
  uploading = false;
  progress = 0;
  clubs = [];
  newName;
  newAddress;
  newOpeningHours;
  newClosingHours;
  newPrice;
  newDate;
  newDistance;
  user = {} as User;
  // map
  vMessages = {
    name: [
      { type: "required", message: "Email address is required." },
      { type: "minlength", message: "A minimum of 4 characters required." },
      {
        type: "maxlength",
        message: "No more than 30 character for the title.",
      },
    ],
    distance: [
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "password must be more than 6 characters.",
      },
      {
        type: "maxlength",
        message: "Password must be less than 10 characters.",
      },
    ],

    address: [
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "password must be more than 6 characters.",
      },
      {
        type: "maxlength",
        message: "Password must be less than 10 characters.",
      },
    ],
    openingHours: [
      { type: "required", message: "Event start time is required." },
    ],
    closingHours: [
      { type: "required", message: "Event end time is required." },
    ],
    date: [{ type: "required", message: "Event date is required." }],
    price: [{ type: "required", message: "Event fee is required." }],
  };
  clubKey;
  userZ: any;
  public eventForm: FormGroup;
  uniqkey: string;
  fileRef: any;
  task: any;
  downloadU: any;
  urlPath: any;
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
    console.log("lng:" + JSON.stringify(this.list[i].geometry.coordinates[0]));
    console.log("lat:" + JSON.stringify(this.list[i].geometry.coordinates[1]));
    this.lng = JSON.stringify(this.list[i].geometry.coordinates[0]);
    this.lat = JSON.stringify(this.list[i].geometry.coordinates[1]);
    //  this.user.coords = [this.lng,this.lat];
    console.log("index =" + i);
    console.log(this.selectedAddress);
    this.userr = this.selectedAddress;
    console.log(this.user);
    this.addresses = [];
    // this.addresses=[];
  }
  //address
  constructor(
    private storage: AngularFireStorage,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    public runn: RunningService,
    private authService: AuthService,
    private mapboxService: MapboxService,
    private loadingController: LoadingController,
    public mainService: MainServiceService,
    public route: Router,
    public zone: NgZone,
    public alertCtrl: AlertController
  ) {
    this.eventForm = fb.group({
      name: [
        "",
        Validators.compose([
          Validators.minLength(4),
          Validators.maxLength(30),
          Validators.required,
        ]),
      ],
      distance: ["", Validators.compose([Validators.required])],
      address: ["", Validators.required],
      openingHours: ["", Validators.required],
      closingHours: ["", Validators.required],
      date: ["", Validators.required],
      price: ["", Validators.compose([Validators.required])],
    });
    this.clubs = [];
    this.theUser = [];
  }

  ngOnInit() {
    this.clubKey = this.route.getCurrentNavigation().extras.state.club;
    console.log(this.clubKey);
  }
  async addEvent(formData) {
    if (!this.photoURL) {
      const alerter = await this.alertCtrl.create({
        header: "No Image!",
        message:
          "Please upload the image that will help with the identification of this event.",
        buttons: ["Okay"],
      });
      await alerter.present();
    } else {
      let open = new Date(formData.openingHours).getTime();
      let closed = new Date(formData.closingHours).getTime();
      let hours = Math.abs(closed - open) / 36e5;

      if (closed <= open) {
        this.mainService.handleError('Please select the correct time.');
      } else {
        const eventData = {
          ...formData,
          ...{
            userID: this.mainService.user.uid,
            clubKey: this.clubKey,
            photoURL: this.photoURL,
            hours:parseFloat(hours.toFixed(0)),
          },
        };
        this.mainService
          .createEvent(eventData)
          .then((res) => {
            console.log(res);
            this.route.navigate(["/tabs/events"]);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  uploadEventPic(event) {
    this.zone.run(() => {
      this.uploading = true;
      const file = event.target.files[0];
      // File or Blob named mountains.jpg
      console.log(event, file);

      // Create the file metadata

      // Upload file and metadata to the object 'images/mountains.jpg'
      const uploadTask = this.storageRef.child("images/" + file.name).put(file);

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
            this.photoURL = downloadURL;
            this.uploading = false;
            this.progress = 0;
            console.log(this.urlPath);
          });
        }
      );
    });
  }
  file(filePath: any, file: any): any {
    throw new Error("Method not implemented.");
    //
  }
  back() {}
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "loading...",
      duration: 4000,
    });
    await loading.present();

    loading.dismiss();
  }
}
