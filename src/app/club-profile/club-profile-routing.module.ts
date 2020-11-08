import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClubProfilePage } from './club-profile.page';

const routes: Routes = [
  {
    path: '',
    component: ClubProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClubProfilePageRoutingModule {}
