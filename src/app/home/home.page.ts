import { map } from "rxjs/operators";
import { Component, NgZone, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { RunningService } from "../services/running.service";
import { LoadingController } from "@ionic/angular";
import * as firebase from "firebase";
import { MainServiceService } from "../services/main-service.service";
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  constructor(
    private router: Router,
    public runn: RunningService,
    public loadingController: LoadingController,
    private zone: NgZone,
    private mainService: MainServiceService
  ) {
    this.tickets = [];
    this.clubs = [];
    this.getUser();
    this.getTickets();
    this.presentLoading();
  }
  db = firebase.firestore();
  clubsExpanded = false;
  clubHeight = 0;
  clubs = [];
  tempClubs = [];
  tickets = [];
  theUser = "";
  hasATicket = false;
  hasAClub = "c";
  defaultpic = true;
  isSlide: boolean = true;
  slides: any;
  slideOpts = {
    slidesPerView: 1.1,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
  };
  slideOptsT = {
    slidesPerView: 1.1,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
  };
  myEvents;
  closingHours;
  openingHours;
  address;
  date;
  name;
  userEvents: any = [];
  loader;
  userProfile: any = {};
  ngOnDestroy() {}
  ionViewDidEnter() {
    this.getdata();
    this.getUserEvents();
    // Set the user Profile Image
    this.mainService.getUserProfile().then((data: any) => {
      this.userProfile = data;
    });
  }
  ionViewDidLeave() {
    this.tickets = [];
    this.clubs = [];
  }
  ngOnInit() {
    
  }
  expandClass() {
    this.zone.run(() => {
      this.clubsExpanded = !this.clubsExpanded;
    });
  }
  finishEvent(event) {
this.zone.run(() => {
  this.mainService.finishEvent(event).then(res => {
    this.getUserEvents();
  })
})
  }
  cancelEvent(event) {
this.zone.run(() =>{
  this.mainService.cancelEvent(event).then(res => {
    this.getUserEvents();
  })
})
  }
  getUserEvents() {
    this.mainService.getUserEvents().then((res) => {
      this.userEvents = res;
    });
  }
  searchClubs(ev: any) {
    this.zone.run(() => {
      // Reset items back to all of the items
      // set val to the value of the searchbar
      const val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != "") {
        this.clubs = this.tempClubs.filter((item) => {
          return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
      } else if (val != " ") {
        this.clubs = this.tempClubs.filter((item) => {
          return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
      } else if (val == "") {
        this.clubs = this.tempClubs;
      }
    });
  }
  getTickets() {
    return new Promise((resolve, reject) => {
      this.tickets = [];
      this.runn.rtTickets().then((data) => {
        // tslint:disable-next-line: prefer-for-of
        for (let x = 0; x < data.length; x++) {
          this.tickets.push({
            bookingID: data[x].bookingID,
            eventKey: data[x].eventKey,
            name: data[x].name,
            address: data[x].address,
            openingHours: data[x].openingHours,
            closingHours: data[x].closingHours,
            userID: data[x].userID,
            clubID: data[x].clubKey,
            price: data[x].price,
            date: data[x].date,
            tickets: data[x].tickets,
            total: data[x].total,
            approved: data[x].approved,
            deposited: data[x].deposited,
          });
        }

        if (this.tickets.length != 0 && this.tickets != null) {
          this.hasATicket = true;
        }
      });
    });
  }

  getdata() {
    this.mainService.getAllClubs().then((res: any) => {
      if (!res) {
        this.hasAClub = "n";
      } else {
        this.clubs = res;
        this.tempClubs = res;
      }
    });
  }

  getUser() {
    this.db
      .collection("users")
      .doc(this.mainService.user.uid)
      .get()
      .then((doc) => {
        this.theUser = doc.data().photoURL;
      });
  }
  slideChanged() {
    this.slides.startAutoplay();
  }
  go() {
    this.router.navigateByUrl("book-event");
  }
  goHome() {
    this.router.navigateByUrl("home");
  }
  gotoProfile() {
    this.router.navigateByUrl("profile");
  }
  getBooked() {
    this.runn.getBooked().subscribe((data) => {
      this.myEvents = data.map((e) => {
        return {
          key: e.payload.doc.id,
          closingHours: e.payload.doc.data()["closingHours"],
          openingHours: e.payload.doc.data()["openingHours"],
          address: e.payload.doc.data()["address"],
          name: e.payload.doc.data()["name"],
          date: e.payload.doc.data()["date"],
          approved: e.payload.doc.data()["approved"],
        } as Events; // the Item is the class name in the item.ts
      });

      // tslint:disable-next-line: prefer-for-of
      for (let r = 0; r < this.myEvents.length; r++) {
        if (this.myEvents[r].approved === true) {
          this.tickets.push({
            key: this.myEvents[r].key,
            closingHours: this.myEvents[r].closingHours,
            openingHours: this.myEvents[r].openingHours,
            address: this.myEvents[r].address,
            name: this.myEvents[r].name,
            date: this.myEvents[r].date,
            approved: this.myEvents[r].approved,
          });
        }
        console.log(this.tickets);
      }
      if (this.tickets.length === 0 && this.tickets === null) {
        this.hasATicket = false;
      }
    });
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      message: "Gettind Clubs. Please wait...",
    });
    // await this.loader.present();
  }
  chooseClub(myclubs) {
    let nav: NavigationExtras = {
      state: {
        nav: myclubs.clubKey,
      },
    };
    this.router.navigate(["club-home"], nav);
    this.runn.chooseClub(myclubs);
  }
}
