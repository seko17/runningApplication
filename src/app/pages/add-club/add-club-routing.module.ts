import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddClubPage } from './add-club.page';

const routes: Routes = [
  {
    path: '',
    component: AddClubPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddClubPageRoutingModule {}
