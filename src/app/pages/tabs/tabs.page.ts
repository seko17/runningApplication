import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, NavController } from '@ionic/angular';
import { MainServiceService } from 'src/app/services/main-service.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  url = 'home';

  constructor(
    private route: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private ngZone: NgZone,
    private mainService: MainServiceService
  ) {}
  // /tabs/login
  ngOnInit() {}
  setUrl(page) {
    this.ngZone.run(() => {
      this.url = page;
    })
  }
  async logout() {
    const alerter = await this.alertCtrl.create({
      header: 'Sign Out',
      message: 'This will sign you out of the app, Continue?',
      buttons: [
          {
          text: 'Continue',
          handler: async () => {
            this.mainService.logoutUser()
            .then(() => {
              this.navCtrl.navigateRoot('login');
            });
          },
        },
        {
          text: 'Cancel',
          cssClass: 'danger',
        },
      ],
    });
    alerter.present();
  }
}
