import { Router } from '@angular/router';
import { Component, NgZone, OnInit } from '@angular/core';
import { RunningService } from 'src/app/services/running.service';
import * as firebase from 'firebase';
import { MainServiceService } from 'src/app/services/main-service.service';
@Component({
  selector: 'app-club-home',
  templateUrl: './club-home.page.html',
  styleUrls: ['./club-home.page.scss'],
})
export class ClubHomePage implements OnInit {
  db = firebase.firestore();
  club = {
    address: null,
    closingHours: null,
    openingHours: null,
    name: null,
    photoURL: null,
    id: null,
  };
  saved = false;
  events = [];
  hasAEvent = false;
  clubKey = '';
  showEvents = false;
  checkingEvents = false;
  constructor(
    public runn: RunningService,
    private route: Router,
    private zone: NgZone,
    public mainService: MainServiceService
  ) {

    this.events = [];
  }
  tempEvents = [1, 2, 3, 4, 5, 6, 7, 8, 9, 9];
  ngOnInit() {
    this.zone.run(() => {
      this.clubKey = this.route.getCurrentNavigation().extras.state.nav;
      this.db
        .collection('clubs')
        .doc(this.clubKey)
        .get()
        .then((res) => {
          this.club = {
            address: res.data().address,
            closingHours: res.data().closingHours,
            openingHours: res.data().openingHours,
            name: res.data().name,
            photoURL: res.data().photoURL,
            id: res.data().userID,
          };
        });
    });
  }

  getEvents() {
    this.checkingEvents = true;
    this.zone.run(() => {
      this.mainService.getClubEvents(this.clubKey).then((res: any) => {
        if (res.length == 0) {
          this.mainService.handleToasts('No events for this club.');
          this.checkingEvents = false;
        } else {
          this.events = res;
          this.showEvents = true;
          this.checkingEvents = false;
        }
      });
    });
  }
  getEES() {
    this.events = [];

    return new Promise((resolve, reject) => {
      this.runn.rtClubEvents().then((data) => {
        console.log(data.length);
        for (let x = 0; x < data.length; x++) {
          console.log(x);

          this.events.push({
            eventKey: data[x].eventKey,
            name: data[x].name,
            address: data[x].address,
            date: data[x].date,
            openingHours: data[x].openingHours,
            closingHours: data[x].closingHours,
            price: data[x].price,
            photoURL: data[x].photoURL,
            clubKey: data[x].clubKey,
          });
        }
        if (this.events.length != 0 && this.events != null) {
          this.hasAEvent = true;
          this.saved = true;
        }

        console.log(this.events, 'LAST ONE');
      });
    });
  }
  booking(myevents) {
    this.runn.booking(myevents);
  }
  clearEvents() {
    this.events = [];
    this.saved = false;
  }
  onClick() {
    this.showEvents = false;
    this.route.navigate(['tabs/home']);
  }
}
