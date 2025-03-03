import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthGuard } from './auth.guard';
import { PrincipalPageComponent } from './pages/principal-page/principal-page.component';
import { LoginAuthGuard } from './login-auth.guard';

export const routes: Routes = [
  { path: 'Inicio', component: PrincipalPageComponent },
  { path: 'Login', component: LoginPageComponent },
  { path: '**', redirectTo: 'Login' },
];
