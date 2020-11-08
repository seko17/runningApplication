import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookEventPageRoutingModule } from './book-event-routing.module';

import { BookEventPage } from './book-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookEventPageRoutingModule
  ],
  declarations: [BookEventPage]
})
export class BookEventPageModule {}
