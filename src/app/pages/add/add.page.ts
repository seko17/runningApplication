import { Component, OnInit } from "@angular/core";
import { RunningService } from "src/app/services/running.service";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import * as firebase from "firebase";
import { MainServiceService } from "src/app/services/main-service.service";
@Component({
  selector: "app-add",
  templateUrl: "./add.page.html",
  styleUrls: ["./add.page.scss"],
})
export class AddPage implements OnInit {
  db = firebase.firestore();
  myclubs;
  clubs = [];
  hasAClub = false;
  isSlide: boolean = true;
  slides: any;
  slideOpts = {
    slidesPerView: 1,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
  };
  constructor(
    public runn: RunningService,
    private router: Router,
    public loadingController: LoadingController,
    public mainService: MainServiceService
  ) {
    this.clubs = [];
  }
  ngOnInit() {}
  ionViewDidEnter() {
    this.getData();
  }
  slideChanged() {
    this.slides.startAutoplay();
  }
  getData() {
    this.mainService.getUserClubs().then((res: any) => {
      this.clubs = res;
    });
  }

  ngOnDestroy() {

  }
  ionViewDidLeave() {
    this.clubs = [];
 
  }

  getAClubsEvents(myclub) {
    this.router.navigateByUrl("tabs/club-profile");
  }
}
