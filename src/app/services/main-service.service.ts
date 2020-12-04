import { Observable } from "rxjs";
import { Injectable, NgZone } from "@angular/core";
import * as firebase from "firebase";
import {
  NavController,
  LoadingController,
  AlertController,
  ToastController,
} from "@ionic/angular";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class MainServiceService {
  db = firebase.firestore();
  storage = firebase.storage().ref();
  user = firebase.auth().currentUser;
  loader;
  error;
  constructor(
    public navCtrl: NavController,
    public route: Router,
    public zone: NgZone,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public mainService: MainServiceService,
    public loadingCtrl: LoadingController
  ) {}

  // EVENT FUNCTIONS
  /**
   * Gets all Events
   */
  public async getAllEvents() {
    return new Promise((resolve, reject) => {
      this.zone.run(() => {
        this.handleLoader("Getting Events. Please wait...", true);
        const events = [];
        this.db
          .collection("events")
          .get()
          .then((res) => {
            res.forEach((doc) => {
              this.db
                .collection("bookedEvents")
                .where("eventId", "==", doc.id)
                .where("personBooked", "==", this.user.uid)
                .get()
                .then((response) => {
                  if (response.size > 0) {
                    events.push({
                      ...doc.data(),
                      ...{ eventId: doc.id },
                      ...{ booked: true },
                    });
                  } else {
                    events.push({
                      ...doc.data(),
                      ...{ eventId: doc.id },
                      ...{ booked: false },
                    });
                  }
                });
            });
            resolve(events);
            this.handleLoader("", false);
          })
          .catch((err) => {
            reject(err);
            this.handleLoader("", false);
          });
      });
    });
  }
  /**
   * Gets Events specific to the User
   */
  public async getUserEvents() {
    const userEvents = [];
    return new Promise((resolve, reject) => {
    this.zone.run(() => {
      this.db
      .collection("bookedEvents")
      .where("personBooked", "==", this.user.uid)
      .get()
      .then((res) => {
        res.forEach((doc) => {
          userEvents.push(doc.data());
        });
        resolve(userEvents);
      })
      .catch((err) => {
        reject(err);
      });
    })
    });
  }

  public async getBookedEvents() {}
  /**
   *
   * @param event Contains the event information (Object)
   * @param data contains additional data about the event (Object)
   */
  public async bookEvent(event, data) {
    // Load the process
    this.handleLoader("Making your Booking. Please wait...", true);
    // invoke new promise
    return new Promise((resolve, reject) => {
      // add booking data
      this.db
        .collection("bookedEvents")
        .add({ ...event, ...data })
        .then(async (doc) => {
          this.handleLoader("", false);
          this.zone.run(() => {
            // navigate upon success
            resolve(doc.id);
          });
        })
        .catch(async (error) => {
          this.handleLoader("", false);
          this.zone.run(async () => {
            this.handleError(
              "Something went wrong with the transaction please try again."
            );
            reject(false);
          });
        });
    });
  }
  createEvent() {}
  // END EVENT ACTIVITIES


  // CLUB FUNCTIONS

  public async getAllClubs() {
    const clubs = [];
    return new Promise((resolve, reject) => {
      this.db
      .collection('clubs')
      .get()
      .then(async (res) => {
        res.forEach(async (doc) => {
          clubs.push({ clubKey: doc.id, ...doc.data() });
        });
        if (res.size == 0) {
          resolve(false);
        } else {
          resolve(clubs);
        }
      }).catch(err => {
        this.handleError(err.message);
        reject(err);
      });
    });
  }

  // END CLUB FUNCTIONS
  // FEEDBACK FUNCTIONS
  /**
   *
   * @param message Message to be displayed while the error is active
   */
  public async handleError(message) {
    this.loader = await this.alertCtrl.create({
      header: "Oops!",
      message,
      buttons: ["Okay"],
    });
    this.loader.present();
  }

  /**
   *
   * @param message Message to be displayed while the loader is active
   * @param option Condition that opens or closes the loader (Boolean)
   */
  public async handleLoader(message, option) {
    switch (option) {
      case true:
        this.loader = await this.loadingCtrl.create({
          message,
        });
        await this.loader.present();
        break;
      case false:
        try {
          this.loader.dismiss();
        } catch (error) {
          console.log("Cannot dismiss an un-presented loader.");
        }
        break;
    }
  }
  // END FEEDBACK FUNCTIONS
}
