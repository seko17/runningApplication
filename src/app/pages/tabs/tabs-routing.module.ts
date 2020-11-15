import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('../../pages/profile/profile.module').then((m) => m.ProfilePageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../../home/home.module').then((m) => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../../pages/events/events.module').then((m) => m.EventsPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../../pages/add/add.module').then((m) => m.AddPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
