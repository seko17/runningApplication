import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RunningService } from 'src/app/services/running.service';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';
@Component({
  selector: 'app-done',
  templateUrl: './done.page.html',
  styleUrls: ['./done.page.scss'],
})
export class DonePage implements OnInit {
  db = firebase.firestore()
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
  myAccount;
  name: string;
  bookingId;
  theName: string;
  constructor(
    private route: ActivatedRoute,
    public runn: RunningService,
    private navCtrl: NavController
  ) {
    this.runn.getAccount().subscribe((data) => {
      this.myAccount = data.map((e) => {
        return {
          key: e.payload.doc.id,
          bank: e.payload.doc.data()['bank'],
          account: e.payload.doc.data()['account'],
          branch: e.payload.doc.data()['branch'],
          type: e.payload.doc.data()['type'],
          recipient: e.payload.doc.data()['recipient'],
          // ...e.payload.doc.data
        } as Account; // the Item is the class name in the item.ts
      });
      console.log(this.myAccount);
    });
  }
  user() {
    let user = this.runn.readCurrentSession();
    this.name = user.uid;
    this.theName = this.name.substring(0, 5);
    console.log('loged in user: ', this.theName);
  }

  tickets;
  price;
  total;
  ngOnInit() {
    this.route.queryParams.subscribe((data) => {
      console.log(data);
      this.tickets = parseFloat(data.tickets);
      this.price = parseFloat(data.price);
      this.bookingId = data.bookingId;
      this.total = this.tickets * this.price;
    });
    this.user();
  }
  updateDeposit() {
    this.db.collection('bookedEvents').doc(this.bookingId).update({deposited: true}).then(res => {
      console.log('Deposited');
      this.navCtrl.navigateForward('complete')
    })
  }
}
