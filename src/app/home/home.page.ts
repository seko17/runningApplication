import { Component, NgZone, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { RunningService } from '../services/running.service';
import { LoadingController } from '@ionic/angular';
import * as firebase from 'firebase';
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
    private zone: NgZone
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
  hasAClub = false;
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
  ngOnDestroy() {}
  ionViewDidEnter() {
    this.getdata();
  }
  ionViewDidLeave() {
    this.tickets = [];
    this.clubs = [];
  }
  ngOnInit() {}
  expandClass() {
    this.zone.run(() => {
      this.clubsExpanded = !this.clubsExpanded;
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
    this.clubs = [];
    this.db
      .collection('clubs')
      .get()
      .then((res) => {
        res.forEach((doc) => {
          this.clubs.push({clubKey: doc.id, ...doc.data()});
        });
        console.log(this.clubs);
        
      });
  }

  getUser() {
    this.db
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
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
    const loading = await this.loadingController.create({
      message: 'loading...',
      duration: 4000,
    });
    await loading.present();

    loading.dismiss();
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
