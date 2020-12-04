import { Component, NgZone, OnInit } from "@angular/core";
import { RunningService } from "src/app/services/running.service";
import { NavigationExtras, Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import * as firebase from "firebase";
// import moment from "moment";
@Component({
  selector: "app-events",
  templateUrl: "./events.page.html",
  styleUrls: ["./events.page.scss"],
})
export class EventsPage implements OnInit {
  db = firebase.firestore();
  hasAEvent = false;
  events = [];
  slideOpts = {
    slidesPerView: 1.5,
  };
  sponsors = [
    {
      url: "https://www.herbalife.com",
      image:
        "https://i2.wp.com/abbylangernutrition.com/wp-content/uploads/2015/12/herbalife-logo.jpg",
    },
    {
      url: "https://www.sprint.com",
      image:
        "https://www.allconnect.com/wp-content/uploads/2020/07/cellphones-sprint-hero-sprint.jpg",
    },
    {
      url: "https://www.wish.com",
      image:
        "https://www.verdict.co.uk/wp-content/uploads/2019/08/wish-funding-round.jpg",
    },
  ];
  constructor(
    public runn: RunningService,
    public route: Router,
    public loadingController: LoadingController,
    public zone: NgZone
  ) {
    this.getdata();
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    console.log("foo destroy");
  }

  //  date1;
  getdata() {
this.zone.run(() => {
  this.events = [];
  this.db
    .collection("events")
    .get()
    .then((res) => {
      res.forEach((doc) => {
        let event = doc.data();
        let eventId = {eventId: doc.id,};
        this.events.push({...event, ...eventId});
      });
      console.log(this.events);
    });
})
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "loading...",
      duration: 4000,
    });
    await loading.present();

    loading.dismiss();
  }

  book() {
    this.route.navigate(["/book-event"]);
  }
  booking(e) {
    const nav: NavigationExtras = {
      state: {
        event: e,
      },
    };
    this.route.navigate(['/tabs/book-event'], nav);
  }
  ngOnInit() {}
}
