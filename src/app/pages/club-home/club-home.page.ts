import { Router } from '@angular/router';
import { Component, NgZone, OnInit } from '@angular/core';
import { RunningService } from 'src/app/services/running.service';
import * as firebase from 'firebase';
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
  constructor(
    public runn: RunningService,
    private route: Router,
    private zone: NgZone
  ) {
    this.club = [];
    this.events = [];
  }
  tempEvents = [1, 2, 3, 4, 5, 6, 7, 8, 9, 9];
  ngOnInit() {
    this.zone.run(() => {
      console.log('Club home');
      const clubKey = this.route.getCurrentNavigation().extras.state;
      this.db
        .collection('clubs')
        .doc(clubKey.nav)
        .get()
        .then((res) => {
          console.log();
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

  getdata() {
    this.club = [];
    return new Promise((resolve, reject) => {
      this.club = [];
      this.runn.rtAClubs().then((data) => {
        console.log(data.length);

        console.log(data[0].myclubs[0].myclubs.clubKey, 'flower child');

        this.club.push({
          clubKey: data[0].myclubs[0].myclubs.clubKey,
          name: data[0].myclubs[0].myclubs.name,
          address: data[0].myclubs[0].myclubs.address,
          openingHours: data[0].myclubs[0].myclubs.openingHours,
          closingHours: data[0].myclubs[0].myclubs.closingHours,
          userID: data[0].myclubs[0].myclubs.userID,
          photoURL: data[0].myclubs[0].myclubs.photoURL,
        });

        console.log(this.club, 'LAST ONE ts');
      });
    });
  }

  getAClubsEvents(myclub) {
    //  this.runn.getAClubsEvents(myclub)
    this.getEES();
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
    this.route.navigate(['tabs/home']);
  }
}
