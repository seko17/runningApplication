import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  urls = '';
  constructor(
    private route: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}
  // /tabs/login
  ngOnInit() {}
  async logout() {
    const alerter = await this.alertCtrl.create({
      header: 'Sign Out',
      message: 'This will sign you out of the app, Continue?',
      buttons: [
          {
          text: 'Continue',
          handler: async () => {
            await this.afAuth.auth
              .signOut()
              .then((success) => {
                console.log(success);
                console.log('success');
                this.navCtrl.navigateRoot('login');
              })
              .catch((error) => {
                console.log(error);
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
