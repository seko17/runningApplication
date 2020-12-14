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
  userProfile;
  loader;
  successLoader;
  error;
  constructor(
    public navCtrl: NavController,
    public route: Router,
    public zone: NgZone,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public mainService: MainServiceService,
    public loadingCtrl: LoadingController
  ) {
    console.log("[MAIN SERVICE FIRED]");

    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    });
  }
  // USER AUTH STATE FUNCTIONS
  /**
   * Logs the user in
   * @param email String
   * @param password String
   */
  public async loginUser(email, password) {
    return new Promise((resolve, reject) => {
      this.zone.run(() => {
        this.handleLoader("Signing in, Please wait...", true);
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then((res) => {
            firebase.auth().onAuthStateChanged((user) => {
              this.user = user;
              resolve(user);
              this.handleLoader("", false);
            });
          })
          .catch((err) => {
            this.handleError(err.message);
            reject(err);
            this.handleLoader("", false);
          });
      });
    });
  }
  /**
   * Gets the user's Profile
   */
  getUserProfile() {
    return new Promise((resolve, reject) => {
      this.zone.run(() => {
        this.db
          .collection("users")
          .doc(this.user.uid)
          .get()
          .then((res) => {
            resolve(res.data());
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }
  /**
   * Logs the user in and creates their profile
   * @param email (String)
   * @param password (String)
   * @param profileInfo Profile of the new user (Object)
   */
  public async signUpUser(email, password, profileInfo) {
    return new Promise((resolve, reject) => {
      this.zone.run(() => {
        this.handleLoader("Creating Account, Please wait...", true);
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((res) => {
            firebase.auth().onAuthStateChanged((user) => {
              this.user = user;
            });
            this.db
              .collection("users")
              .doc(res.user.uid)
              .set({ ...profileInfo, ...{ uid: res.user.uid } })
              .then(() => {
                resolve(true);
                this.handleLoader("", false);
              })
              .catch((err) => {
                this.handleError(err.message);
                reject(err);
                this.handleLoader("", false);
                this.handleError(
                  "Something went wrong with creating your Profile, Please try creating it again under the Profile tab."
                );
              });
          })
          .catch((err) => {
            this.handleError(err.message);
            reject(err);
            this.handleLoader("", false);
          });
      });
    });
  }
  /**
   * Logs the user out
   */
  public async logoutUser() {
    return new Promise((resolve, reject) => {
      this.zone.run(() => {
        this.handleLoader("Signing out, Please wait...", true);
        firebase
          .auth()
          .signOut()
          .then((res) => {
            firebase.auth().onAuthStateChanged((user) => {
              this.user = null;
              resolve(true);
              this.handleLoader("", false);
            });
          })
          .catch((err) => {
            this.handleError(err.message);
            reject(err);
            this.handleLoader("", false);
          });
      });
    });
  }
  // END USER AUTH STATE FUNCTIONS

  // EVENT FUNCTIONS
  /**
   * Get account info for payment
   * returns an array of accounts
   */
  public async getAccountInfo() {
    const accounts = [];
    return new Promise((resolve, reject) => {
      this.db
        .collection("account")
        .get()
        .then((res) => {
          res.forEach((doc) => {
            accounts.push(doc.data());
          });
          resolve(accounts);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  /**
   * Gets all events and
   * manages the booked state to determine whether the event is booked or not.
   */
  public async getAllEvents() {
    return new Promise((resolve, reject) => {
      this.zone.run(() => {
        // initialise loader
        this.handleLoader("Getting Events. Please wait...", true);
        const events = [];
        // get events
        this.db
          .collection("events")
          .get()
          .then((res) => {
            // for each document, go into booked events
            res.forEach((doc) => {
              // using the current event id and the logged in user check if this event was booked
              this.db
                .collection("bookedEvents")
                .where("eventId", "==", doc.id)
                .where("personBooked", "==", firebase.auth().currentUser.uid)
                .get()
                .then((response) => {
                  if (response.size > 0) {
                    events.push({
                      ...doc.data(),
                      ...{ eventId: doc.id },
                      ...{ booked: true },
                    });
                  } else {
                    events.unshift({
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
              userEvents.push({ docId: doc.id, ...doc.data() });
            });
            resolve(userEvents);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }
  /**
   * @param event Event data (Object)
   */
  public async finishEvent(event) {
    return new Promise(async (resolve, reject) => {
      const alerter = await this.alertCtrl.create({
        message: "This event will be marked as complete. Continue?",
        buttons: [
          {
            text: "Not yet",
            role: "cancel",
          },
          {
            text: "Yes",
            handler: () => {
              this.handleLoader("Just a sec...", true);

              // Update the user stats
              this.db
                .collection("users")
                .doc(this.user.uid)
                .update({
                  hours: firebase.firestore.FieldValue.increment(
                    parseFloat(event.hours)
                  ),
                  kilos: firebase.firestore.FieldValue.increment(
                    parseFloat(event.distance)
                  ),
                  runs: firebase.firestore.FieldValue.increment(1),
                })
                .then((res) => {
                  // copy the booking to past Events
                  this.db
                    .collection("pastEvents")
                    .doc(event.docId)
                    .set(event)
                    .then((res) => {
                      // Delete the booked event
                      this.db
                        .collection("bookedEvents")
                        .doc(event.docId)
                        .delete()
                        .then((res) => {
                          this.handleLoader("", false);
                          resolve(true);
                          this.handleToasts(
                            "Congrats. We hope you enjoyed yourself during the event."
                          );
                        })
                        .catch((err) => {
                          this.handleLoader("", false);
                          this.handleError(
                            "Something went wrong. Please try again later."
                          );
                          reject(err);
                        });
                    })
                    .catch((err) => {
                      this.handleLoader("", false);
                      reject(err);
                    });
                })
                .catch((err) => {
                  this.handleLoader("", false);
                  this.handleError(
                    "Something went wrong. Please try again later."
                  );
                  reject(err);
                });
            },
          },
        ],
      });
      await alerter.present();
    });
  }
  /**
   * @param event Event data (Object)
   */
  public async cancelEvent(event) {
    return new Promise(async (resolve, reject) => {
      const alerter = await this.alertCtrl.create({
        header: "Warning!",
        message:
          "You are about to cancel this booking, all ticket purchases are not refundable. Continue?",
        buttons: [
          {
            text: "Yes",
            handler: () => {
              this.handleLoader("Just a sec...", true);
              this.db
                .collection("bookedEvents")
                .doc(event.docId)
                .delete()
                .then((res) => {
                  this.handleLoader("", false);
                  this.handleSuccess(
                    "Booking removed. We sorry to see you not participating. You can book another event."
                  );
                  resolve(true);
                })
                .catch((err) => {
                  this.handleLoader("", false);
                  this.handleError(
                    "Something went wrong. Please try again later."
                  );
                  reject(err);
                });
            },
          },
        ],
      });
      await alerter.present();
    });
  }
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
  /**
   * Creates an event
   * @param data Event Data (Object)
   * Resolves the created event's document id
   */
  createEvent(data) {
    this.handleLoader("Creating event. Please wait...", true);
    return new Promise((resolve, reject) => {
      this.db
        .collection("events")
        .add(data)
        .then((res) => {
          resolve(res.id);
          this.handleLoader("", false);
          this.handleSuccess("Event created successfully.");
        })
        .catch((err) => {
          this.handleLoader("", false);
          reject(err);
        });
    });
  }
  // END EVENT ACTIVITIES

  // CLUB FUNCTIONS
  /**
   * Returns all clubs with their document Id
   * Resolves false if nothing came back
   */
  public async getAllClubs() {
    const clubs = [];
    return new Promise((resolve, reject) => {
      this.db
        .collection("clubs")
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
        })
        .catch((err) => {
          this.handleError(err.message);
          reject(err);
        });
    });
  }

  /**
   * @param clubId Unique clubId(String)
   */
  getClubEvents(clubId) {
    const events = [];
    return new Promise((resolve, reject) => {
      this.db
        .collection("events")
        .where("clubKey", "==", clubId)
        .get()
        .then((res) => {
          res.forEach((doc) => {
            events.push(doc.data());
          });
          resolve(events);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  /**
   * Creates a new club and
   * Returns the document id of the club created
   * @param clubData Club data
   */
  createClub(clubData) {
    this.handleLoader("Creating Club. Please wait...", true);

    return new Promise((resolve, reject) => {
      this.db
        .collection("clubs")
        .add(clubData)
        .then((res) => {
          resolve(res.id);
          this.handleLoader("", false);
          this.handleSuccess(
            "Your new club is now available. Go create events for it."
          );
        })
        .catch((err) => {
          reject(err);
          this.handleLoader("", false);
          this.handleError(
            "Could not creat your club this time. Please try again later."
          );
        });
    });
  }
  /**
   * Gets clubs created by the logged in user
   */
  getUserClubs() {
    const userClubs = [];
    return new Promise((resolve, reject) => {
      this.handleLoader('Getting your Clubs. Please wait...', true)
      this.db
        .collection("clubs")
        .where("userID", "==", this.user.uid)
        .get()
        .then((res) => {
          res.forEach((doc) => {
            const club = { clubKey: doc.id, ...doc.data() };
            userClubs.push(club);
          });
          resolve(userClubs);
          this.handleLoader('', false)
        })
        .catch((err) => {
          reject(err);
          this.handleLoader('', false)
        });
    });
  }
  // END CLUB FUNCTIONS

  // FEEDBACK FUNCTIONS
  /**
   * @param message Message to be displayed while the error is active
   */
  public async handleError(message) {
    this.loader = await this.alertCtrl.create({
      header: "Oops!",
      message,
      cssClass: "errorAlert",
      buttons: ["Okay"],
    });
    this.loader.present();
  }
  /**
   * @param message Message to be displayed while the success is active
   */
  public async handleSuccess(message) {
    this.successLoader = await this.alertCtrl.create({
      header: "Success!",
      message,
      cssClass: "successAlert",
      buttons: ["Okay"],
    });
    this.successLoader.present();
  }
  /**
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
  /**
   * @param message Message to be displayed while the toast is active
   */
  public async handleToasts(message) {
    const toaster = await this.toastCtrl.create({
      message,
      duration: 3000,
    });
    await toaster.present();
  }
  // END FEEDBACK FUNCTIONS
}
