import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
//  import * as firebase from 'firebase';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { TabsPage } from './pages/tabs/tabs.page';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { TabsPageModule } from './pages/tabs/tabs.module';


const firebaseConfig = {
  apiKey: "AIzaSyAv85O55WcgVEXgWUTr5GVqspI__ywOSn4",
    authDomain: "runningclub-46ede.firebaseapp.com",
    databaseURL: "https://runningclub-46ede.firebaseio.com",
    projectId: "runningclub-46ede",
    storageBucket: "runningclub-46ede.appspot.com",
    messagingSenderId: "248528881431",
    appId: "1:248528881431:web:efbea0811a4460f39f5952",
    measurementId: "G-X04V0DEYV3"
}; 
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [AppComponent, TabsPage],
  entryComponents: [],
  imports: [
    BrowserModule,
 //   TabsPageModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(firebaseConfig),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
