import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BASE_URL = environment.apiUrl;
  private readonly HEADERS = new HttpHeaders().set(
    'Authorization',
    `Token ${localStorage.getItem('token')}`
  );

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(`${this.BASE_URL}login/`, { username, password });
  }

  register(email: string, username: string, password: string) {
    return this.http.post(`${this.BASE_URL}users/`, { username, password, email });
  }

  userInformation() {
    return this.http.get(`${this.BASE_URL}users/me/`, { headers: this.HEADERS });
  }

  logout() {
    return this.http.post(`${this.BASE_URL}token/logout/`, {}, { headers: this.HEADERS }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
