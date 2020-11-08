import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventHomePage } from './event-home.page';

const routes: Routes = [
  {
    path: '',
    component: EventHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventHomePageRoutingModule {}
