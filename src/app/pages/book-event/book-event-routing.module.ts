import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookEventPage } from './book-event.page';

const routes: Routes = [
  {
    path: '',
    component: BookEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookEventPageRoutingModule {}
