import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoadingController, MenuController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public forgotpasswordForm: FormGroup;
  isForgotPassword: boolean = true;
  // loading: any;

 
  constructor(private  authService:  AuthService,
     private  router:  Router,
     
     public fb: FormBuilder,
     private alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController
     ) { 

  }

  

ngOnInit() {
  
  this.loginForm = this.fb.group({
    email: [ 'nhlanhla@gmail.com',Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
    password: ['nhlanhla', Validators.compose([Validators.minLength(6), Validators.maxLength(12), Validators.required])],
  });
  this.forgotpasswordForm = this.fb.group({
    email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
  })
}
ionViewWillEnter() {
  this.menuCtrl.enable(false);
}
async login() {
  const loading = this.loadingCtrl.create({
    message: 'Signing in, Please wait...',
    duration: 4000,
   
  });
  (await loading).present();
​ 
  this.authService.login(this.loginForm.value.email, this.loginForm.value.password).then(async () => {
   
    (await loading).dismiss();
  });
​
}
​
registerPage() {
  this.router.navigateByUrl("signup")
}
​
forgotpassword() {
  this.isForgotPassword = false;
}
Cancel() {
  this.isForgotPassword = true;
}
reset() {
  this.authService.sendPasswordResetEmail(this.forgotpasswordForm.value.email)
    .then((success) => {
      this.alertCtrl.create({
        // message: 'You can not order more than six',
        subHeader: 'Check your Email account',
        buttons: ['Ok']
      }).then(
        alert => alert.present()
      );
      this.isForgotPassword = true;
    }).catch((error) => {
      this.alertCtrl.create({
        // message: 'You can not order more than six',
        subHeader: 'Wrong Email',
        buttons: ['Ok']
      }).then(
        alert => alert.present()
      );
    })
​
​
}


}
