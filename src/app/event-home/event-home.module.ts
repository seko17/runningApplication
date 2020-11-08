import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventHomePageRoutingModule } from './event-home-routing.module';

import { EventHomePage } from './event-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventHomePageRoutingModule
  ],
  declarations: [EventHomePage]
})
export class EventHomePageModule {}
