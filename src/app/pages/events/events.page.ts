import { Component, OnInit } from "@angular/core";
import { RunningService } from "src/app/services/running.service";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
// import moment from "moment";
@Component({
  selector: "app-events",
  templateUrl: "./events.page.html",
  styleUrls: ["./events.page.scss"],
})
export class EventsPage implements OnInit {
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
    public loadingController: LoadingController
  ) {
    this.events = [];
    this.getdata();
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    console.log("foo destroy");
  }
  ionViewDidEnter() {
    this.getdata();
  }
  ionViewDidLeave() {
    this.events = [];
    console.log("k");
  }

  //  date1;
  getdata() {
    console.log(this.runn.rtEvents());
    this.runn.getEvent().subscribe((eventList) => {
      for (let x = 0; x < eventList.length; x++) {
        this.events.push({
          eventKey: eventList[x].id,
          name: eventList[x].name,
          address: eventList[x].address,
          openingHours: eventList[x].openingHours,
          closingHours: eventList[x].closingHours,
          price: eventList[x].price,
          clubKey: eventList[x].clubKey,
          date: eventList[x].date,
          photoURL: eventList[x].photoURL,
        });
        console.log("<<<<<", this.events[x]);
      }
      if (this.events.length != 0 && this.events != null) {
        this.hasAEvent = true;
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
  booking(myevents) {
    this.runn.booking(myevents);
  }
  ngOnInit() {}
}
