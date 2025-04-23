import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-header',
  imports: [RouterModule, NavBarComponent],
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
