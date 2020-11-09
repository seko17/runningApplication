import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {

  public forgotpasswordForm: FormGroup;
  isForgotPassword: boolean;
  

  constructor(private fb: FormBuilder, private authService:AuthService, private alertCtrl:AlertController, private navCtrl:NavController) { 
    this.forgotpasswordForm = fb.group({

      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
    })
  }
  forgotpassword() {
    this.isForgotPassword = false;
  }
  Cancel() {
    this.navCtrl.navigateRoot("login");
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
      });
  }
  ngOnInit() {
  }

}
