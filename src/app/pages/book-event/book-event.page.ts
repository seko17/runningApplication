import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { RunningService } from 'src/app/services/running.service';
import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
// import { eventNames } from 'cluster';
import * as firebase from 'firebase';
@Component({
  selector: 'app-book-event',
  templateUrl: './book-event.page.html',
  styleUrls: ['./book-event.page.scss'],
})
export class BookEventPage implements OnInit {
  db = firebase.firestore();
  eventName;
  bookingID;
  eventAddress;
  eventOpeningHours;
  eventClosingHours;
  price: number;
  eventKey;
  tickets = 0;
  total = 0;
  hasAEvent = true;
  events = [];
  event: any = {};
  constructor(
    public navCtrl: NavController,
    private clubService: RunningService,
    public route: Router,
    private location: Location,
    public zone: NgZone,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
    this.events = [];
    // this.bookE();
  }

  ngOnInit() {
    this.zone.run(() => {
      this.event = this.route.getCurrentNavigation().extras.state.event;
      console.log(this.event);
    });
  }
  backClicked() {
    this.location.back();
  }
  bookE() {
    return new Promise((resolve, reject) => {
      this.clubService.rtBooking().then((data) => {
        this.events = [];
        console.log(data.length, ' book ts selected event', data);
        this.events.push({
          eventKey: data[0].myevents[0].myevents.eventKey,
          name: data[0].myevents[0].myevents.name,
          address: data[0].myevents[0].myevents.address,
          openingHours: data[0].myevents[0].myevents.openingHours,
          closingHours: data[0].myevents[0].myevents.closingHours,
          price: data[0].myevents[0].myevents.price,
          date: data[0].myevents[0].myevents.date,
          clubKey: data[0].myevents[0].myevents.clubKey,
        });
        this.eventKey = '';
        this.eventKey = data[0].myevents[0].myevents.eventKey;

        if (this.events === null) {
          this.hasAEvent = false;
        }

        console.log(this.events, 'the events');
        this.price = data[0].myevents[0].myevents.price;
      });
    });
  }

  back() {
    this.route.navigate(['/tabs/events']);
  }

  add(num: number) {
    if (this.tickets <= 5) { this.tickets = this.tickets + num; }
  }
  // subtructing tickets
  sub(num: number) {
    this.tickets = this.tickets - num;
    if (this.tickets < 0) {
      this.tickets = 0;
    }

    //
    // this.total=this.price*this.tickets;
  }
  BookEvent() {
    const p = this.event.price * this.tickets;
    this.db
    .collection('bookedEvents')
    .add({...this.event, ...{
      tickets: this.tickets,
      total: p,
      approved: false,
      deposited: false}})
    .then(async (data) => {
      this.route.navigate(['/tabs/done'], {
        queryParams: { tickets: this.tickets, price: p, bookingId: data.id},
      });
    })
    .catch( async (error) => {
      const alerter = await this.alertCtrl.create({
        header: 'Process Error',
        message: 'Something went wrong with the transaction please try again.',
        buttons: ['Okay']
      });
      await alerter.present();
    });


    // console.log(tickets,price,"=================",this.tickets,this.price);
  }
}
