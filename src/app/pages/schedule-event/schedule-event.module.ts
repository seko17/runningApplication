import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleEventPageRoutingModule } from './schedule-event-routing.module';

import { ScheduleEventPage } from './schedule-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleEventPageRoutingModule

    
  ],
  declarations: [ScheduleEventPage]
})
export class ScheduleEventPageModule {}
