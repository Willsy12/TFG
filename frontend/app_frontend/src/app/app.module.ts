import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // ✅ Importar HttpClientModule
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthService } from './services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PrincipalPageComponent } from './pages/principal-page/principal-page.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { MatListModule } from '@angular/material/list';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

@NgModule({
  declarations: [AppComponent, LoginPageComponent, PrincipalPageComponent, NavBarComponent],
  imports: [
    BrowserModule,
    FormsModule, // ✅ Agregar aquí
    ReactiveFormsModule,
    HttpClient,
    MatSlideToggleModule,
    RouterModule.forRoot(routes),
    CommonModule,
    MatListModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
