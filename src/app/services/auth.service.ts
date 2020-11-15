import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  AlertController,
  NavController,
  LoadingController,
} from "@ionic/angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, of } from "rxjs";
import { resolve } from "url";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
// import { AngularFireStorage } from '@angular/fire/storage';
import { switchMap, finalize } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/storage";

declare var gapi: any;

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: Observable<User>;
  calendarItems: any;
  currentSession;
  currentUser;
  currentSessionId;
  userProfile = [];
  currentState: boolean;
  selectedFile = null;
  uploadPercent: any;
  downloadU: any;
  uniqkey: any;
  today: any = new Date();
  date =
    this.today.getDate() +
    "" +
    (this.today.getMonth() + 1) +
    "" +
    this.today.getFullYear();
  time = this.today.getHours() + "" + this.today.getMinutes();
  dateTime = this.date + "" + this.time;
  progress;
  theUser;

  constructor(
    public alertCtrl: AlertController,

    private afs: AngularFirestore,
    public loadingCtrl: LoadingController,
    private db: AngularFirestore,
    public navCtrl: NavController,
    private storage: AngularFireStorage,

    private afAuth: AngularFireAuth
  ) {
    this.initClient();

    afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        // this.navCtrl.navigateRoot("home");
      } else {
        this.navCtrl.navigateRoot("");
      }
    });
    this.user = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async signup(email, password) {
    const loading = this.loadingCtrl.create({
      message: "Registering, Please wait...",
    });
    (await loading).present();

    await this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (success) => {
        this.setCurrentSession(firebase.auth());
        console.log(success);
        (await loading).dismiss();
      })
      .catch(async (err) => {
        (await loading).dismiss();

        this.alertCtrl
          .create({
            subHeader: err.message,
            buttons: ["Ok"],
          })
          .then((alert) => alert.present());
      });
  }
  who() {
    let user = firebase.auth();
    console.log('[RUNNING SERVICE WHO] >>> ', user);
    
    return user;
    // return this.theUser;
  }
  async login(email: string, password: string) {
    //

    await this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then((success) => {
        this.setCurrentSession(firebase.auth());
        this.theUser = firebase.auth();
        this.navCtrl.navigateRoot("tabs/home");
        return this.theUser;
      })
      .catch((err) => {
        this.alertCtrl
          .create({
            // message: 'You can not order more than six',
            subHeader: err.message,
            buttons: ["Ok"],
          })
          .then((alert) => alert.present());
      });
  }
  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  async logout() {
    await this.afAuth.auth
      .signOut()
      .then((success) => {
        console.log(success);
        console.log("success");
        this.navCtrl.navigateRoot("login");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  ///set user session start
  setCurrentSession(user) {
    console.log("running");
    var uid;
    if (user !== null) {
      uid = user.currentUser.uid;
      this.user = user.currentUser;
      console.log(uid);

      var userRoot = firebase.database().ref("Users").child(uid);
      userRoot.once("value", (snap) => {
        //console.log(userRoot);
        let values = snap.val();
        console.log(values["name"]);
        console.log(values["email"]);
        this.userProfile.push({
          key: snap.key,
          displayName: values["name"],
          email: values["email"],
        });
      });
    }
    this.currentSessionId = uid;
    console.log(uid);
    console.log(user);
    console.log(this.user);
  }
  ///set user session end
  destroyUserData() {
    this.userProfile.pop();
    console.log(this.userProfile);
  }
  readCurrentSession() {
    console.log(this.user);
    return this.user;
  }
  returnUserProfile() {
    console.log(this.userProfile);
    return this.userProfile;
  }

  async pickImage() {}

  uploadProfilePic(event) {
    let user = this.readCurrentSession();
    let userID = user["uid"];
    console.log("the user", userID);
    const file = event.target.files[0];
    this.uniqkey = "PIC" + this.dateTime;
    const filePath = this.uniqkey;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    // observe percentage changes
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadU = fileRef.getDownloadURL().subscribe((urlPath) => {
            console.log(urlPath);

            this.afs.doc("users/" + userID).update({
              photoURL: urlPath,
            });
            this.uploadPercent = null;
          });
        })
      )
      .subscribe();
    return (this.uploadPercent = task.percentageChanges());
  }

  getUsers() {
    return this.afs
      .collection("users", (ref) => ref.orderBy("displayName"))
      .valueChanges();
  }
  getUID(): string {
    return this.afAuth.auth.currentUser.uid;
  }

  initClient() {
    gapi.load("client", () => {
      console.log("loaded client");
      // https://www.youtube.com/watch?v=Bj15-6rBHQw
      // https://developers.google.com/calendar/quickstart/js
      gapi.client.init({
        apiKey: "AIzaSyAv85O55WcgVEXgWUTr5GVqspI__ywOSn4",
        clientId: "AIzaSyDYkSYgroyp5uv7g69WVXmC7rRAKdf8EmE",
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        ],
      });
    });
  }
}
