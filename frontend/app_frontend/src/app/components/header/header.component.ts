import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  username: string;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.userInformation().subscribe({
      next: (result: any) => {
        this.username = result.username;
      },
    });
  }
}
