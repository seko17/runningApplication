import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleEventPage } from './schedule-event.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleEventPageRoutingModule {}
