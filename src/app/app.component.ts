import { Component, OnInit } from '@angular/core';

import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'profile',
      url: 'profile',
      icon: 'contact'
    },
    // {
    //   title: 'list',
    //   url: '/list',
    //   icon: 'list'
    // },
    {
      title: 'Add Club',
      url: 'add-club',
      icon: 'list'
    },
    {
      title: 'Add Event',
      url: 'add-event',
      icon: 'list'
    }
   
  ];
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'loading...',
      duration: 4000
    });
    await loading.present();
    // this.getdata()
    loading.dismiss()
  }
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService : AuthService,
    public loadingController: LoadingController
  ) {
   
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  log() {
    this.authService.logout();
  }
  ngOnInit() {
    this.initializeApp();
    this.presentLoading();
  }
}
