import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RunningService } from 'src/app/services/running.service';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { MainServiceService } from 'src/app/services/main-service.service';
@Component({
  selector: 'app-done',
  templateUrl: './done.page.html',
  styleUrls: ['./done.page.scss'],
})
export class DonePage implements OnInit {
  db = firebase.firestore();
  theAccount = {
    name: '',
    account: 0,
    bank: '',
    branch: 0,
    recipient: '',
    type: '',
  };
  theUser = [];
  private uid: string = null;
  email: any;
  accounts = [];
  name: string;
  bookingId;
  theName: string;
  tickets;
  price;
  total;
  constructor(
    private activatedRoute: ActivatedRoute,
    public route: Router,
    public runn: RunningService,
    private navCtrl: NavController,
    private zone: NgZone,
    private mainService: MainServiceService
  ) {
    this.mainService.getAccountInfo().then((res: any) => {
      this.accounts = res;
    });

  }
  ngOnInit() {
    this.generateReference();
    this.activatedRoute.queryParams.subscribe((data) => {
      console.log(data);
      this.tickets = parseFloat(data.tickets);
      this.price = parseFloat(data.price);
      this.bookingId = data.bookingId;
      this.total = this.tickets * this.price;
    });
  }
  back() {
    this.route.navigate(['tabs/events']);
  }
  generateReference() {
    let user = this.runn.readCurrentSession();
    this.name = user.uid;
    this.theName = this.name.substring(0, 5);
    console.log('loged in user: ', this.theName);
  }
  updateDeposit() {
    this.zone.run(() => {
      this.db
        .collection('bookedEvents')
        .doc(this.bookingId)
        .update({ deposited: true })
        .then((res) => {
          console.log('Deposited');
          this.navCtrl.navigateForward('complete');
        });
    });
  }
}
