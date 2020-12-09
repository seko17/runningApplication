import { MainServiceService } from 'src/app/services/main-service.service';
import { Component, NgZone, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as firebase from 'firebase';
import { 
  LoadingController,
  MenuController,
  AlertController,
  ToastController,
} from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  auth = firebase.auth();
  public loginForm: FormGroup;
  public forgotpasswordForm: FormGroup;
  isForgotPassword: boolean = true;
  passwordToggle = false;
  // loading: any;

  constructor(
    private authService: AuthService,
    private router: Router,

    public fb: FormBuilder,
    private alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public mainService: MainServiceService,
    public zone: NgZone
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [
        "",
        Validators.compose([
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
          Validators.required,
        ]),
      ],
      password: [
        "",
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(12),
          Validators.required,
        ]),
      ],
    });
    this.forgotpasswordForm = this.fb.group({
      email: [
        "",
        Validators.compose([
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
          Validators.required,
        ]),
      ],
    });
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
  async login() {
      this.mainService.loginUser( this.loginForm.value.email, this.loginForm.value.password ).then(res => {
        console.log(res);
      });
  }
  registerPage() {
    this.zone.run(() => {
      this.router.navigateByUrl("signup");
    })
  }
  async forgotpassword() {
    const alerter = await this.alertCtrl.create({
      header: 'Reset Password',
      message: 'Please provide the email to send the password reset link to.',
      inputs: [{
        name: 'email',
        placeholder: 'Email'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Send Link',
        handler: (data) => {
          this.auth.sendPasswordResetEmail(data.email).then(async (res) => {

            const toaster = await this.toastCtrl.create({
              message: `Link Send to ${data.email}. Check Email.`,
              duration: 3000
            });
            await toaster.present();
          }).catch(async err => {
            const toaster = await this.toastCtrl.create({
              message: `An error occurred, could not send email. Try again Later.`,
              duration: 3000
            });
            await toaster.present();
          })
        }
      }]
    });
    await alerter.present();
  }
  Cancel() {
    this.isForgotPassword = true;
  }
  reset() {
    this.authService
      .sendPasswordResetEmail(this.forgotpasswordForm.value.email)
      .then((success) => {
        this.alertCtrl
          .create({
            // message: 'You can not order more than six',
            subHeader: "Check your Email account",
            buttons: ["Ok"],
          })
          .then((alert) => alert.present());
        this.isForgotPassword = true;
      })
      .catch((error) => {
        this.alertCtrl
          .create({
            // message: 'You can not order more than six',
            subHeader: "Wrong Email",
            buttons: ["Ok"],
          })
          .then((alert) => alert.present());
      });
  }
  showPasswordToggle() {
    this.passwordToggle = !this.passwordToggle;
  }
  toSignup() {
    this.router.navigate(["signup"]);
  }
  resetPassword(){
    this.router.navigate(["reset"]);
  }
}
