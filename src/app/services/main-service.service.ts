import { Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase';
import {
  NavController,
  LoadingController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MainServiceService {
  db = firebase.firestore();
  storage = firebase.storage().ref();
  user = firebase.auth().currentUser;
  userProfile;
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
  ) {
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
        this.handleLoader('Signing in, Please wait...', true);
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then((res) => {
            firebase.auth().onAuthStateChanged((user) => {
              this.user = user;
              resolve(user);
              this.handleLoader('', false);
            });
          })
          .catch((err) => {
            this.handleError(err.message);
            reject(err);
            this.handleLoader('', false);
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
        this.db.collection('users').doc(this.user.uid).get().then(res => {
          resolve(res.data());
        })
        .catch(err => {
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
        this.handleLoader('Creating Account, Please wait...', true);
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((res) => {
            firebase.auth().onAuthStateChanged((user) => {
              this.user = user;
            });
            this.db
              .collection('users')
              .doc(res.user.uid)
              .set({ ...profileInfo, ...{ uid: res.user.uid } })
              .then(() => {
                resolve(true);
                this.handleLoader('', false);
              })
              .catch((err) => {
                this.handleError(err.message);
                reject(err);
                this.handleLoader('', false);
                this.handleError(
                  'Something went wrong with creating your Profile, Please try creating it again under the Profile tab.'
                );
              });
          })
          .catch((err) => {
            this.handleError(err.message);
            reject(err);
            this.handleLoader('', false);
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
        this.handleLoader('Signing out, Please wait...', true);
        firebase
          .auth()
          .signOut()
          .then((res) => {
            firebase.auth().onAuthStateChanged((user) => {
              this.user = null;
              resolve(true);
              this.handleLoader('', false);
            });
          })
          .catch((err) => {
            this.handleError(err.message);
            reject(err);
            this.handleLoader('', false);
          });
      });
    });
  }
  // END USER AUTH STATE FUNCTIONS
  // EVENT FUNCTIONS
  /**
   * Gets all events and
   * updates the booked state to determine whether the event is booked or not.
   */
  public async getAllEvents() {
    return new Promise((resolve, reject) => {
      this.zone.run(() => {
        // initialise loader
        this.handleLoader('Getting Events. Please wait...', true);
        const events = [];
        // get events
        this.db
          .collection('events')
          .get()
          .then((res) => {
            // for each document, go into booked events
            res.forEach((doc) => {
              // using the current event id and the logged in user check if this event was booked
              this.db
                .collection('bookedEvents')
                .where('eventId', '==', doc.id)
                .where('personBooked', '==', firebase.auth().currentUser.uid)
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
            this.handleLoader('', false);
          })
          .catch((err) => {
            reject(err);
            this.handleLoader('', false);
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
          .collection('bookedEvents')
          .where('personBooked', '==', this.user.uid)
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
      });
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
    this.handleLoader('Making your Booking. Please wait...', true);
    // invoke new promise
    return new Promise((resolve, reject) => {
      // add booking data
      this.db
        .collection('bookedEvents')
        .add({ ...event, ...data })
        .then(async (doc) => {
          this.handleLoader('', false);
          this.zone.run(() => {
            // navigate upon success
            resolve(doc.id);
          });
        })
        .catch(async (error) => {
          this.handleLoader('', false);
          this.zone.run(async () => {
            this.handleError(
              'Something went wrong with the transaction please try again.'
            );
            reject(false);
          });
        });
    });
  }
  createEvent() {}
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
        })
        .catch((err) => {
          this.handleError(err.message);
          reject(err);
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
      header: 'Oops!',
      message,
      buttons: ['Okay'],
    });
    this.loader.present();
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
          console.log('Cannot dismiss an un-presented loader.');
        }
        break;
    }
  }
  // END FEEDBACK FUNCTIONS
}
