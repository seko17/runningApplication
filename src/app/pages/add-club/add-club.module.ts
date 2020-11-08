import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddClubPageRoutingModule } from './add-club-routing.module';

import { AddClubPage } from './add-club.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddClubPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddClubPage]
})
export class AddClubPageModule {


  
}
