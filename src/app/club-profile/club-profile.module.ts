import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClubProfilePageRoutingModule } from './club-profile-routing.module';

import { ClubProfilePage } from './club-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClubProfilePageRoutingModule
  ],
  declarations: [ClubProfilePage]
})
export class ClubProfilePageModule {}
