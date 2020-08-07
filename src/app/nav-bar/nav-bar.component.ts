import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  title = 'FlashCard App';

  get loggedIn() {
    return this.auth.loggedIn;
  }

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  login(): void {
    this.auth.login();
  }

  logout(): void {
    this.auth.logout();
  }
}
