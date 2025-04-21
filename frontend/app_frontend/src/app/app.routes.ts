import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthGuard } from './auth.guard';
import { PrincipalPageComponent } from './pages/principal-page/principal-page.component';
import { LoginAuthGuard } from './login-auth.guard';
import { VideogameLayoutComponent } from './components/Videogame/videogame-layout/videogame-layout.component';
import { VideogameDetailComponent } from './components/Videogame/videogame-detail/videogame-detail.component';
import { CustomListLayoutComponent } from './components/customLists/custom-list-layout/custom-list-layout.component';
import { CustomListDetailComponent } from './components/customLists/custom-list-detail/custom-list-detail.component';
import { WishListComponent } from './components/WishList/wish-list/wish-list.component';
import { FriendshipListComponent } from './components/Friendship/friendship-list/friendship-list.component';
import { ActivityComponent } from './components/activity/activity.component';

export const routes: Routes = [
  {
    path: '',
    component: PrincipalPageComponent,
    children: [
      { path: '', component: VideogameLayoutComponent },
      { path: 'detail/:id', component: VideogameDetailComponent },
      { path: 'Mis-Listas', component: CustomListLayoutComponent },
      { path: 'Mis-Listas/detail/:id', component: CustomListDetailComponent },
      { path: 'WishList', component: WishListComponent },
      { path: 'PlayedList', component: WishListComponent },
      { path: 'Amistades', component: FriendshipListComponent },
      { path: 'Actividad', component: ActivityComponent },
    ],
    canActivate: [AuthGuard],
  },
  { path: 'Login', component: LoginPageComponent },
];
