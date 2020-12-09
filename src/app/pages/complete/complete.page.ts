import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.page.html',
  styleUrls: ['./complete.page.scss'],
})
export class CompletePage implements OnInit {

  constructor(public route: Router, public zone: NgZone) { }

  ngOnInit() {
  }
  back() {
    this.zone.run(() => {
      this.route.navigate(['tabs/home']);
    })
  }
}
