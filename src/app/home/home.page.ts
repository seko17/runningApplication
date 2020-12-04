import { map } from 'rxjs/operators';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { RunningService } from '../services/running.service';
import { LoadingController } from '@ionic/angular';
import * as firebase from 'firebase';
import { MainServiceService } from '../services/main-service.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
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
  tempCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  clubsExpanded = false;
  clubHeight = 0;
  clubs = [];
  tickets = [];
  theUser = '';
  hasATicket = false;
  hasAClub = 'c';
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
  ngOnDestroy() {}
  ionViewDidEnter() {
    this.getdata();
  }
  ionViewDidLeave() {
    this.tickets = [];
    this.clubs = [];
  }
  ngOnInit() {
    this.getUserEvents();
  }
  expandClass() {
    this.zone.run(() => {
      this.clubsExpanded = !this.clubsExpanded;
    });
  }
  getUserEvents() {
    this.mainService
      .getUserEvents()
      .then((res) => {
        this.userEvents = res;
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
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
        this.hasAClub = 'n';
      } else {
        this.clubs = res;
      }
    });
  }

  getUser() {
    this.db
      .collection('users')
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
    this.router.navigateByUrl('book-event');
  }
  goHome() {
    this.router.navigateByUrl('home');
  }
  gotoProfile() {
    this.router.navigateByUrl('profile');
  }
  getBooked() {
    this.runn.getBooked().subscribe((data) => {
      this.myEvents = data.map((e) => {
        return {
          key: e.payload.doc.id,
          closingHours: e.payload.doc.data()['closingHours'],
          openingHours: e.payload.doc.data()['openingHours'],
          address: e.payload.doc.data()['address'],
          name: e.payload.doc.data()['name'],
          date: e.payload.doc.data()['date'],
          approved: e.payload.doc.data()['approved'],
        } as Events; // the Item is the class name in the item.ts
      });
      console.log(this.myEvents);

      for (let r = 0; r < this.myEvents.length; r++) {
        console.log(this.myEvents[r].approved, '&&&&&&');
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
      message: 'Gettind Clubs. Please wait...',
    });
    // await this.loader.present();
  }
  chooseClub(myclubs) {
    let nav: NavigationExtras = {
      state: {
        nav: myclubs.clubKey,
      },
    };
    this.router.navigate(['club-home'], nav);
    this.runn.chooseClub(myclubs);
  }
}
