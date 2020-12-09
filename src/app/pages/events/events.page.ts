import { Component, ViewChild, NgZone, OnInit } from "@angular/core";
import { RunningService } from "src/app/services/running.service";
import { NavigationExtras, Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import * as firebase from "firebase";
import { MainServiceService } from "src/app/services/main-service.service";
// import moment from "moment";
@Component({
  selector: "app-events",
  templateUrl: "./events.page.html",
  styleUrls: ["./events.page.scss"],
})
export class EventsPage implements OnInit {
  @ViewChild("scrollcontent", { static: false }) scrollContent;
  db = firebase.firestore();
  hasAEvent = false;
  events = [];
  tempEvents = [];
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
  scrollUpButton = false;

  constructor(
    public runn: RunningService,
    public route: Router,
    public loadingController: LoadingController,
    public zone: NgZone,
    public mainService: MainServiceService
  ) {}
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    console.log("foo destroy");
  }
  ionViewDidEnter() {
    this.getdata();
  }
  //  date1;
  logScrolling(event) {
    this.zone.run(() => {
      const yScroll = event.detail.currentY;
      if (yScroll > 500) {
        this.scrollUpButton = true;
      } else {
        this.scrollUpButton = false;
      }
    });
  }
  scrollToTop() {
    this.scrollContent.scrollToTop(1000);
    
  }
  getdata() {
    this.zone.run(() => {
      this.events = [];

      this.mainService.getAllEvents().then((res: any) => {
        this.events = res;
        this.tempEvents = res;
        res.forEach((element) => {
          console.log(element);
        });
      });
    });
  }
  searchEvents(ev: any) {
    this.zone.run(() => {
      // Reset items back to all of the items
      // set val to the value of the searchbar
      const val = ev.target.value;
      console.log(ev.target);

      // if the value is an empty string don't filter the items
      if (val && val.trim() != "") {
        this.events = this.tempEvents.filter((item) => {
          return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
        console.log(this.events);
      } else if (val != " ") {
        this.events = this.tempEvents.filter((item) => {
          return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
      } else if (val == "") {
        this.events = this.tempEvents;
      }
    });
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
    this.zone.run(() => {
      const nav: NavigationExtras = {
        state: {
          event: e,
        },
      };
      this.route.navigate(["/tabs/book-event"], nav);
    });
  }
  ngOnInit() {}
}
