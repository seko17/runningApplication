import { Component, OnInit } from "@angular/core";

import { Platform, LoadingController, NavController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AuthService } from "./services/auth.service";
import * as firebase from 'firebase';
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: "Home",
      url: "/home",
      icon: "home",
    },
    {
      title: "profile",
      url: "profile",
      icon: "contact",
    },
    // {
    //   title: 'list',
    //   url: '/list',
    //   icon: 'list'
    // },
    {
      title: "Add Club",
      url: "add-club",
      icon: "list",
    },
    {
      title: "Add Event",
      url: "add-event",
      icon: "list",
    },
  ];
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Loading...",
      duration: 4000,
    });
    await loading.present();
    // this.getdata()
    loading.dismiss();
  }
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    public loadingController: LoadingController,
    private navCtrl: NavController
  ) {}

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  log() {
    // this.authService.logout();
  }
  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      console.log('{USER LOGGED IN >>> ', user);
      
      if (user) {
        this.navCtrl.navigateRoot('tabs/home');
      } else {
        this.navCtrl.navigateRoot('login');
      }
    })
    this.initializeApp();
    // this.presentLoading();
  }
}
