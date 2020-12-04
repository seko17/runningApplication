import { Injectable } from "@angular/core";
import * as firebase from "firebase";
// import * as moment from 'moment';
import "firebase/firestore";
import { AuthService } from "./auth.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { switchMap, finalize, map } from "rxjs/operators";
import {
  NavController,
  LoadingController,
  AlertController,
  ToastController,
} from "@ionic/angular";
import { Router } from "@angular/router";
// import { eventNames } from 'cluster';
import {
  AngularFirestoreDocument,
  AngularFirestore,
} from "@angular/fire/firestore";
@Injectable({
  providedIn: "root",
})
export class RunningService {
  database = firebase.database();
  dbfire = firebase.firestore();
  userProfile = [];
  currentState: boolean;
  currentUser;
  bookingID;
  currClub = [];
  theCurrentClub;
  currentSessionId;
  user;
  clubs = [];
  clubsTemp = [];
  usersTemp = [];
  events = [];
  eventsTemp = [];
  tickets = [];
  ticketsTemp = [];
  users = [];
  myclubs = [];
  // INI values
  newName = "";
  newAddress = "";
  newOpeningHours = "";
  newClosingHours = "";

  newID = "";
  fileRef;
  editName = "";
  editAddress = "";
  editOpeningHours = "";
  editClosingHours = "";
  downloadU: any;
  uniqkey: string;
  dateTime: string;
  uploadPercent: any;
  task: any;
  file: any;
  clubID: String;
  clubKey: String;
  name: String;
  openingHours: String;
  closingHours: String;
  userID: String;
  photoURL: String;
  thetickets = [];
  clubOne = [];
  theprice: string;
  ///

  currentBook = [];
  private itemDoc: AngularFirestoreDocument<Item>;
  eventKey: string;
  address: string;
  price: string;
  constructor(
    public loadingController: LoadingController,
    public auths: AuthService,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    public navCtrl: NavController,
    public route: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  /**
    @param event The event data including its id
  */
  setBooking(event) {
    this.dbfire
      .collection("users")
      .doc(event.id)
      .set(event)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }
  /**
    @param event The event data including its id
    @param status The status (pending, paid, cancelled) to update the event to indicate whether the deposit is made or not: String
  */
  updateBookingStatus(event, status) {
    // tslint:disable-next-line: object-literal-shorthand
    this.dbfire
      .collection('users')
      .doc(event.id)
      .update({ status: status })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }
  currentClub(myclubs) {
    this.currClub = [];
    this.currClub.push({
      myclubs,
    });
  }
  chooseClub(myclubs) {
    return new Promise((resolve, reject) => {
      this.clubOne = [];
      this.clubOne.push({ myclubs });
      resolve(this.clubOne);
    });
  }

  rtClubName() {
    return this.currClub;
  }
  async rtAClubs() {
    let result: any;
    await this.chooseClub(this.clubOne).then((data) => {
      result = data;
    });

    return result;
  }

  async rtClubs() {
    let result: any;
    await this.getClubs().then((data) => {
      result = data;
    });

    // this.LandMarks()
    return result;

    // console.log(this.todos,"hh")
    // return this.todos
  }
  // tickets
  async rtTickets() {
    let result: any;
    await this.getTickets().then((data) => {
      result = data;
    });

    // this.LandMarks()
    return result;

    // console.log(this.todos,"hh")
    // return this.todos
  }
  // tickets
  async rtEvents() {
    let result: any;
    await this.getEvent().subscribe((data) => {
      result = data;
    });
    //
    // this.LandMarks()
    return result;

    // console.log(this.todos,"hh")
    // return this.todos
  }
  async rtClubEvents() {
    let result: any;
    // await this.getAClubsEvents(this.currClub).then(data => {
    //   result = data

    //
    // })

    // this.LandMarks()
    return result;

    // console.log(this.todos,"hh")
    // return this.todos
  }
  // return individuals clubs
  async rtMyClubs() {
    let result: any;
    await this.getIndividualsClubs().then((data) => {
      result = data;
    });

    // this.LandMarks()
    return result;

    // console.log(this.todos,"hh")
    // return this.todos
  }
  async rtUsers() {
    let result: any;
    await this.getUser().then((data) => {
      result = data;
    });

    // this.LandMarks()
    return result;

    // console.log(this.todos,"hh")
    // return this.todos
  }

  // add a club
  addClub(newName, newAddress, newOpeningHours, newClosingHours) {
    const styt = newOpeningHours.substring(11, 16);
    const etyt = newClosingHours.substring(11, 16);
    const user = this.readCurrentSession();
    const userID = user.uid;

    this.uniqkey = newName + "Logo";
    const filePath = this.uniqkey;
    this.fileRef = this.storage.ref(filePath);
    this.task = this.storage.upload(filePath, this.file);
    this.task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadU = this.fileRef
            .getDownloadURL()
            .subscribe((urlPath) => {
              this.dbfire
                .collection("clubs")
                .add({
                  name: newName,
                  address: newAddress,
                  openingHours: styt,
                  closingHours: etyt,
                  userID,
                  photoURL: urlPath,
                })
                .then((data) => {
                  this.navCtrl.navigateRoot("/tabs/add");
                })
                .catch((error) => {
                  console.log(error);
                });

              this.uploadPercent = null;
            });
        })
      )
      .subscribe();
    return (this.uploadPercent = this.task.percentageChanges());
    this.file = null;
  }
  /// update a club
  updateTodo(clubs, editName, editAddress, editOpeningHours, editClosingHours) {
    // name
    this.dbfire
      .collection("clubs")
      .doc(clubs.clubKey)
      .update("name", editName)
      .then((data) => {})
      .catch(function (error) {});
    // address
    this.dbfire
      .collection("clubs")
      .doc(clubs.clubKey)
      .update("address", editAddress)
      .then((data) => {})
      .catch(function (error) {});
    // opening hours
    this.dbfire
      .collection("clubs")
      .doc(clubs.clubKey)
      .update("address", editOpeningHours)
      .then((data) => {})
      .catch(function (error) {});
    // closing hours
    this.dbfire
      .collection("clubs")
      .doc(clubs.clubKey)
      .update("address", editClosingHours)
      .then((data) => {})
      .catch(function (error) {});
  }
  // retrieve a club
  async rtTodo() {
    let result: any;
    await this.getClubs().then((data) => {
      result = data;
    });

    // this.LandMarks()
    return result;
    // console.log(this.todos,"hh")
    // return this.todos
  }
  /////// get todos
  getClubs() {
    this.clubs = [];
    this.clubsTemp = [];
    const ans = [];
    const ans2 = [];
    const user = this.readCurrentSession();
    const userID = user.uid;
    //
    return new Promise((resolve, reject) => {
      this.dbfire
        .collection("clubs")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // ans.push(doc.data())

            this.clubsTemp.push({
              clubKey: doc.id,
              name: doc.data().name,
              address: doc.data().address,
              openingHours: doc.data().openingHours,
              closingHours: doc.data().closingHours,
              userID: doc.data().userID,
              photoURL: doc.data().photoURL,
            });

            //  this.todoTemp.push()
          });

          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < this.clubsTemp.length; x++) {
            if (this.clubsTemp[x].clubKey === userID) {
              this.clubs.push(this.clubsTemp[x]);
            }
          }
          resolve(this.clubsTemp);
        });
    });
  }
  /////// get todos

  /// get a individuals club
  getIndividualsClubs() {
    this.clubs = [];
    this.clubsTemp = [];
    const ans = [];
    const ans2 = [];
    const user = this.readCurrentSession();
    const userID = user.uid;
    //

    return new Promise((resolve, reject) => {
      this.dbfire
        .collection("clubs")
        .where("userID", "==", firebase.auth().currentUser.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.clubsTemp.push({
              clubKey: doc.id,
              name: doc.data().name,
              openingHours: doc.data().openingHours,
              closingHours: doc.data().closingHours,
              userID: doc.data().userID,
              photoURL: doc.data().photoURL,
            });
          });
          resolve(this.clubs);
        });
    });
  }

  //// single clubs events

  //// upload a club pic
  uploadClubPic(event) {
    const user = this.readCurrentSession();
    const userID = user.uid;

    this.file = event.target.files[0];

    // let user = this.readCurrentSession()
    // let userID = user['uid']
    // console.log("the user", userID);
    // this.file = event.target.files[0];
    // console.log(this.file)
    // this.uniqkey = 'PIC' + this.dateTime;
    // const filePath = this.uniqkey;
    // const fileRef = this.storage.ref(filePath);
    // const task = this.storage.upload(filePath, this.file);
    // // observe percentage changes
    // task.snapshotChanges().pipe(
    //   finalize(() => {
    //     this.downloadU = fileRef.getDownloadURL().subscribe(urlPath => {
    //       console.log(urlPath);

    //       this.afs.doc('clubs/' + userID).update({
    //         photoURL: urlPath
    //       })
    //       this.uploadPercent = null;
    //     });
    //   })
    // ).subscribe();
    // return this.uploadPercent = task.percentageChanges();
  }

  deleteTodo(clubs) {
    this.dbfire
      .collection("todos")
      .doc(clubs.todoKey)
      .delete()
      .then((data) => {})
      .catch(function (error) {});
  }
  //
  who() {
    this.user = this.auths.who();
    const user = firebase.auth().currentUser;
    this.setCurrentSession(user);
  }
  /// set user session start
  setCurrentSession(user) {
    let uid;
    if (user !== null) {
      uid = user.uid;
      this.user = user;

      const userRoot = firebase.database().ref("Users").child(uid);
      userRoot.once("value", (snap) => {
        // console.log(userRoot);
        const values = snap.val();

        this.userProfile.push({
          key: snap.key,
          displayName: values.name,
          email: values.email,
        });
      });
    }
    this.currentSessionId = uid;
  }
  /// set user session end
  destroyUserData() {
    this.userProfile.pop();
  }
  readCurrentSession() {
    this.who();

    return this.user;
  }
  returnUserProfile() {
    return this.userProfile;
  }

  /// create event
  addEvent(
    newName,
    newAddress,
    newOpeningHours,
    newClosingHours,
    newPrice,
    newDistance,
    newDate
  ) {
    const styt = newOpeningHours.substring(11, 16);
    const etyt = newClosingHours.substring(11, 16);

    const user = this.readCurrentSession();
    const userID = user.uid;
    const clubKey = this.currClub[0].myclubs.myclubs.clubKey;

    this.uniqkey = newName + "Logo";
    const filePath = this.uniqkey;
    this.fileRef = this.storage.ref(filePath);
    this.task = this.storage.upload(filePath, this.file);
    this.task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadU = this.fileRef
            .getDownloadURL()
            .subscribe((urlPath) => {
              this.dbfire
                .collection("events")
                .add({
                  name: newName,
                  address: newAddress,
                  distance: newDistance,
                  date: newDate,
                  openingHours: styt,
                  closingHours: etyt,
                  userID,
                  clubKey,
                  price: newPrice,
                  photoURL: urlPath,
                })
                .then((data) => {
                  this.presentLoading();
                  this.navCtrl.navigateRoot("/tabs/club-profile");
                })
                .catch((error) => {
                  console.log(error);
                });
              this.uploadPercent = null;
            });
        })
      )
      .subscribe();
    return (this.uploadPercent = this.task.percentageChanges());
    this.file = null;
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "loading...",
      duration: 4000,
    });
    await loading.present();
    // this.getdata()
    loading.dismiss();
  }
  updateUser() {
    const user = this.readCurrentSession();
    const userID = user.uid;
  }
  getUser() {
    this.users = [];
    this.usersTemp = [];
    const ans = [];
    const ans2 = [];

    const user = this.readCurrentSession();
    const userID = user.uid;

    return new Promise((resolve, reject) => {
      this.dbfire
        .collection("users")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // ans.push(doc.data())

            this.usersTemp.push({
              userKey: doc.id,
              name: doc.data().displayName,
              address: doc.data().address,
              age: doc.data().Age,
              email: doc.data().Email,
              gender: doc.data().gender,
              photoURL: doc.data().photoURL,
            });

            //  this.todoTemp.push()
          });

          for (let x = 0; x < this.usersTemp.length; x++) {
            if (this.usersTemp[x].userKey === userID) {
              this.users.push(this.usersTemp[x]);
            }
          }
          resolve(this.users);
        });
    });
  }
  /// get tickets
  getTickets() {
    this.tickets = [];
    this.ticketsTemp = [];

    const user = this.readCurrentSession();
    const userID = user.uid;

    return new Promise((resolve, reject) => {
      this.dbfire
        .collection("bookedEvents")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // ans.push(doc.data())

            this.ticketsTemp.push({
              bookingID: doc.id,
              eventKey: doc.data().eventKey,
              name: doc.data().name,
              address: doc.data().address,
              openingHours: doc.data().openingHours,
              closingHours: doc.data().closingHours,
              userID: doc.data().userID,
              //  clubID:  doc.data().clubID,
              clubKey: doc.data().clubID,
              price: doc.data().price,
              date: doc.data().date,
              //  {{element.data.TimeStamp.toDate() | date:'dd-MM-yyy'}}
              tickets: doc.data().tickets,
              total: doc.data().total,
              approved: doc.data().approved,
              deposited: doc.data().deposited,
            });
          });
          for (let t = 0; t < this.ticketsTemp.length; t++) {
            if (
              this.ticketsTemp[t].userID === userID &&
              this.ticketsTemp[t].approved == true
            ) {
            }
          }

          resolve(this.tickets);
        });
    });
  }

  /// get tickets
  /// retrieve event
  /// update event
  /// delete event
  async rtAccount() {}
  async rtBooking() {
    // method two
    let result: any;
    await this.booking(this.currentBook).then((data) => {
      result = data;
    });

    return result;
  }
  // booking the event
  // approved:boolean=false;
  BookEvent(tickets, price) {
    const user = this.readCurrentSession();
    const userID = user.uid;
    // console.log(tickets,price,"=================",userID);
    const total = tickets * price;
    // console.log(total,"total =================",userID);
    /// method three

    return new Promise((resolve, reject) => {
      this.booking(this.currentBook).then((data) => {
        this.dbfire
          .collection("bookedEvents")
          .add({
            eventKey: data[0].myevents[0].myevents[0].myevents.eventKey,
            name: data[0].myevents[0].myevents[0].myevents.name,
            address: data[0].myevents[0].myevents[0].myevents.address,
            openingHours: data[0].myevents[0].myevents[0].myevents.openingHours,
            closingHours: data[0].myevents[0].myevents[0].myevents.closingHours,
            userID,
            clubID: data[0].myevents[0].myevents[0].myevents.clubKey,
            price: data[0].myevents[0].myevents[0].myevents.price,
            date: data[0].myevents[0].myevents[0].myevents.date,
            //  {{element.data.TimeStamp.toDate() | date:'dd-MM-yyy'}}
            tickets,
            total,
            approved: false,
            deposited: false,
          })
          .then((data) => {
            resolve(data);

            this.bookingID = data.id;
          })
          .catch((error) => {
            console.log(error);
          });
      });
    });
    //   console.log( "somethinf"+event)
  }
  // paying for the event
  payment(eventName, eventAddress, eventPrice, tickets, totalPrice) {
    const user = this.readCurrentSession();
    const userID = user.uid;
    // let clubID= this.currClub[0].clubKey
    // console.log("HOT ",clubID)

    this.dbfire
      .collection("bookedEvents")
      .add({
        event: eventName,
        address: eventAddress,
        userID,
        // clubID: clubID,
        price: eventPrice,
        tickets,
        total: totalPrice,
      })
      .then((data) => {
        //  this.route.navigate(['/edit'],{queryParams:{name: item.name,price:item.price,type:item.type,key:item.key}})
        // this.navCtrl.navigateRoot("/done");
      })
      .catch((error) => {});
  }
  update(objectA, key) {
    this.itemDoc = this.afs.doc<Item>("users/" + key);
    this.itemDoc.update(objectA);
  }
  delete(key) {
    this.itemDoc = this.afs.doc<Item>("users/" + key);
    // this.itemDoc.update(objectA);
    this.itemDoc.delete();
  }
  booking(myevents) {
    this.currentBook = [];

    return new Promise((resolve, reject) => {
      this.currentBook.push({
        myevents,
      });

      resolve(this.currentBook);
    });
  }
  getAccount() {
    return this.afs.collection("account").snapshotChanges();
  }
  getBooked() {
    return this.afs.collection("bookedEvents").snapshotChanges();
  }
  uploadEventPic(event) {
    const user = this.readCurrentSession();
    const userID = user.uid;

    this.file = event.target.files[0];
  }
  uploadProfilePic(event) {
    const user = this.readCurrentSession();
    const userID = user.uid;

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

  updateName(userID, editName) {
    this.dbfire
      .collection("users")
      .doc(userID)
      .update({ displayName: editName })
      .then(async (data) => {
        const toaster = await this.toastCtrl.create({
          message: "Display name updated successfully.",
          duration: 3000,
        });
        await toaster.present();
      })
      .catch(async (error) => {
        const toaster = await this.toastCtrl.create({
          message: "Something went wrong. Your display name was not updated.",
          duration: 3000,
        });
        await toaster.present();
      });
  }

  updateAge(userID, editAge) {
    this.dbfire
      .collection("users")
      .doc(userID)
      .update({ Age: editAge })
      .then(async (data) => {
        const toaster = await this.toastCtrl.create({
          message: "Your age has been updated.",
          duration: 3000,
        });
        await toaster.present();
      })
      .catch(async (error) => {
        const toaster = await this.toastCtrl.create({
          message: "Something went wrong. Your age was not updated.",
          duration: 3000,
        });
        await toaster.present();
      });
  }

  updateAddress(userID, editAddress) {
    this.dbfire
      .collection("users")
      .doc(userID)
      .update({ address: editAddress })
      .then(async (data) => {
        const toaster = await this.toastCtrl.create({
          message: "Your address has been updated.",
          duration: 3000,
        });
        await toaster.present();
      })
      .catch(async (error) => {
        const toaster = await this.toastCtrl.create({
          message: "Something went wrong. Your address was not updated.",
          duration: 3000,
        });
        await toaster.present();
      });
  }

  getEvents() {
    this.events = [];
    this.eventsTemp = [];
    const ans = [];
    const ans2 = [];
    const user = this.readCurrentSession();
    const userID = user.uid;

    return new Promise((resolve, reject) => {
      this.dbfire
        .collection("events")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // ans.push(doc.data())

            this.eventsTemp.push({
              eventKey: doc.id,
              name: doc.data().name,
              address: doc.data().address,
              openingHours: doc.data().openingHours,
              closingHours: doc.data().closingHours,
              price: doc.data().price,
              userID: doc.data().userID,
              date: doc.data().date.toDate,
              clubKey: doc.data().clubID,
            });
          });

          resolve(this.eventsTemp);
        });
    });
  }
  getEvent() {
    this.events = [];
    this.eventsTemp = [];
    const ans = [];
    const ans2 = [];
    const user = this.readCurrentSession();
    const userID = user.uid;

    return this.afs
      .collection<any>("events")
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            const price = a.payload.doc.data().price;
            return { id, ...data };
          })
        )
      );
  }
  updateDeposit() {
    const dep = true;

    this.dbfire
      .collection("bookedEvents")
      .doc(this.bookingID)
      .update("deposited", dep)
      .then((data) => {})
      .catch(function (error) {
        console.error("Error updating document: ", error);
      });
  }
}
