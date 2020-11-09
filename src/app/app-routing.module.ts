import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
// import { HomePage } from './home/home.page';
import { TabsPage } from "./pages/tabs/tabs.page";

const routes: Routes = [
  { path: "", redirectTo: "landing", pathMatch: "full" },
  {
    path: "landing",
    loadChildren: "./pages/landing/landing.module#LandingPageModule",
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "signup",
    loadChildren: () =>
      import("./pages/signup/signup.module").then((m) => m.SignupPageModule),
  },
  {
    path: "reset",
    loadChildren: () =>
      import("./pages/reset/reset.module").then((m) => m.ResetPageModule),
  },

  // {
  //   path: 'list',
  //   loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  // },

  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("./home/home.module").then((m) => m.HomePageModule),
      },

      {
        path: "profile",
        loadChildren: () =>
          import("./pages/profile/profile.module").then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: "add",
        loadChildren: () =>
          import("./pages/add/add.module").then((m) => m.AddPageModule),
      },
      {
        path: "events",
        loadChildren: () =>
          import("./pages/events/events.module").then(
            (m) => m.EventsPageModule
          ),
      },
      {
        path: "landing",
        loadChildren: () =>
          import("./pages/landing/landing.module").then(
            (m) => m.LandingPageModule
          ),
      },
      {
        path: "login",
        loadChildren: () =>
          import("./pages/login/login.module").then((m) => m.LoginPageModule),
      },
      {
        path: "signup",
        loadChildren: () =>
          import("./pages/signup/signup.module").then(
            (m) => m.SignupPageModule
          ),
      },
      {
        path: "reset",
        loadChildren: () =>
          import("./pages/reset/reset.module").then((m) => m.ResetPageModule),
      },
      {
        path: "club-home",
        loadChildren: () =>
          import("./pages/club-home/club-home.module").then(
            (m) => m.ClubHomePageModule
          ),
      },
      // {
      //   path: 'profile',
      //   loadChildren: () => import('./page/profile/profile.module').then( m => m.ProfilePageModule)
      // },

      // {
      //   path: 'payments',
      //   loadChildren: () => import('./pages/payments/payments.module').then( m => m.PaymentsPageModule)
      // },
      {
        path: "payments",
        loadChildren: () =>
          import("./pages/payments/payments.module").then(
            (m) => m.PaymentsPageModule
          ),
      },
      {
        path: "add-club",
        loadChildren: () =>
          import("./pages/add-club/add-club.module").then(
            (m) => m.AddClubPageModule
          ),
      },
      {
        path: "add-event",
        loadChildren: () =>
          import("./pages/add-event/add-event.module").then(
            (m) => m.AddEventPageModule
          ),
      },
      {
        path: "book-event",
        loadChildren: () =>
          import("./pages/book-event/book-event.module").then(
            (m) => m.BookEventPageModule
          ),
      },
      {
        path: "schedule-event",
        loadChildren: () =>
          import("./pages/schedule-event/schedule-event.module").then(
            (m) => m.ScheduleEventPageModule
          ),
      },
      {
        path: "map",
        loadChildren: () =>
          import("./pages/map/map.module").then((m) => m.MapPageModule),
      },

      {
        path: "club-profile",
        loadChildren: () =>
          import("./club-profile/club-profile.module").then(
            (m) => m.ClubProfilePageModule
          ),
      },
      {
        path: "done",
        loadChildren: () =>
          import("./pages/done/done.module").then((m) => m.DonePageModule),
      },
      {
        path: "map",
        loadChildren: () =>
          import("./pages/map/map.module").then((m) => m.MapPageModule),
      },
      {
        path: "complete",
        loadChildren: () =>
          import("./pages/complete/complete.module").then(
            (m) => m.CompletePageModule
          ),
      },
    ],
  },
];

// {
//   path: 'events',
//   loadChildren: () => import('./pages/events/events.module').then( m => m.EventsPageModule)
// },
// {
//   path: 'add',
//   loadChildren: () => import('./pages/add/add.module').then( m => m.AddPageModule)
// },
// {
//   path: 'tabs',
//   loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
// }

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
