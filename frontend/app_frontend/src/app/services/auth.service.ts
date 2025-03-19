import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BASE_URL = 'http://127.0.0.1:8000/api/v1/';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(`${this.BASE_URL}login/`, { username, password });
  }

  register(email: string, username: string, password: string) {
    return this.http.post(`${this.BASE_URL}users/`, { username, password, email });
  }

  userInformation() {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Token ${localStorage.getItem('token')}`
    );
    return this.http.get(`${this.BASE_URL}users/me/`, { headers });
  }
}
