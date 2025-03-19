import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthGuard } from './auth.guard';
import { PrincipalPageComponent } from './pages/principal-page/principal-page.component';
import { LoginAuthGuard } from './login-auth.guard';
import { VideogameLayoutComponent } from './components/Videogame/videogame-layout/videogame-layout.component';
import { VideogameDetailComponent } from './components/Videogame/videogame-detail/videogame-detail.component';

export const routes: Routes = [
  {
    path: 'Inicio',
    component: PrincipalPageComponent,
    children: [
      { path: '', component: VideogameLayoutComponent },
      { path: 'detail/:id', component: VideogameDetailComponent },
    ],
  },
  { path: 'Login', component: LoginPageComponent },
  { path: '**', redirectTo: 'Login' },
];
