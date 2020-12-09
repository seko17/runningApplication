import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, AlertController } from '@ionic/angular';
import { MapboxService, Feature } from 'src/app/services/mapbox.service';
import { MainServiceService } from 'src/app/services/main-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    public alertCtrl: AlertController,
    private afs: AngularFirestore,
    public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private mapboxService: MapboxService,
    public mainService: MainServiceService
  ) {}
  user = {} as User;
  signupForm: FormGroup;
  list: any;
  addresses: string[] = [];
  selectedAddress = null;
  coordinates;
  lat;
  lng;
  userr: any;
  passwordToggle = false;

  //getting selected type of gender
  gender: string = '';

  //getting selected age
  age: string = '';
  // Sign up Form
  ngOnInit() {
    this.signupForm = this.fb.group(
      {
        address: ['', Validators.required],
        gender: ['', Validators.required],
        age: [
          '',
          Validators.compose([
            Validators.required,
            Validators.min(12),
            Validators.max(70),
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.pattern(
              '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
            ),
            Validators.required,
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.minLength(6),
            Validators.maxLength(12),
            Validators.required,
          ]),
        ],
        // cpassword: ['', Validators.required]
      }
      // {
      //   validator: MustMatch('password', 'cpassword')
      // }
    );
  }

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
    this.userr = this.selectedAddress;
    console.log(this.userr);
    this.addresses = [];
    // this.addresses=[];
  }

  showPasswordToggle() {
    this.passwordToggle = !this.passwordToggle;
  }
  tryRegister() {
    const profileInfo = {
      Timestamp: Date.now(),
      Email: this.signupForm.value.email,
      Age: this.signupForm.value.age,
      gender: this.signupForm.value.gender,
      address: this.signupForm.value.address,
      photoURL: '../../../assets/images/giphys.gif',
      Registered: 'no',
      runs: 0,
      kilos: 0,
      hours: 0
    };
    this.mainService
      .signUpUser(
        this.signupForm.value.email,
        this.signupForm.value.password,
        profileInfo
      )
      .then(() => {
        this.navCtrl.navigateRoot('tabs/home');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  goLoginPage() {
    this.navCtrl.navigateForward('login');
  }
  changeGender(event: any) {
    this.gender = event.target.value;
  }
  changeAge(event: any) {
    this.age = event.target.value;
  }

  toSignin() {
    this.router.navigate(['login']);
  }
}
