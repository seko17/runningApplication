import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesPage } from './pages.page';

const routes: Routes = [
  {
    path: '',
    component: PagesPage
  },
  {
    path: 'add-club',
    loadChildren: () => import('./add-club/add-club.module').then( m => m.AddClubPageModule)
  },
  {
    path: 'add-event',
    loadChildren: () => import('./add-event/add-event.module').then( m => m.AddEventPageModule)
  },
  {
    path: 'payments',
    loadChildren: () => import('./payments/payments.module').then( m => m.PaymentsPageModule)
  },
  {
    path: 'schedule-event',
    loadChildren: () => import('./schedule-event/schedule-event.module').then( m => m.ScheduleEventPageModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./events/events.module').then( m => m.EventsPageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'done',
    loadChildren: () => import('./done/done.module').then( m => m.DonePageModule)
  },
  {
    path: 'complete',
    loadChildren: () => import('./complete/complete.module').then( m => m.CompletePageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
  }
  ,
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  }




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule {}
