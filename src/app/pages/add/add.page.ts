import { Component, OnInit } from "@angular/core";
import { RunningService } from "src/app/services/running.service";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import * as firebase from "firebase";
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
    public loadingController: LoadingController
  ) {
    this.clubs = [];
  }
  ngOnInit() {}
  ionViewDidEnter() {
    this.getdata();
  }
  slideChanged() {
    this.slides.startAutoplay();
  }
  getdata() {
    console.log("Getting clubs");
    this.db
      .collection("clubs")
      .where("userID", "==", firebase.auth().currentUser.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.clubs.push({
            clubKey: doc.id,
            name: doc.data().name,
            openingHours: doc.data().openingHours,
            closingHours: doc.data().closingHours,
            userID: doc.data().userID,
            photoURL: doc.data().photoURL,
          });
        });
        console.log("Clubs >>> ", this.clubs);
      });
  }

  ngOnDestroy() {
    console.log("foo destroy");
  }
  // ionViewDidEnter() {
  //   this.getdata();
  // }
  ionViewDidLeave() {
    this.clubs = [];
    console.log("k");
  }

  getAClubsEvents(myclub) {
    console.log(myclub);
    //  this.runn.getAClubsEvents(myclub)
    this.router.navigateByUrl("tabs/club-profile");
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "loading...",
      duration: 2000,
    });
    await loading.present();
    // this.getdata()
    // loading.dismiss()
  }
}
