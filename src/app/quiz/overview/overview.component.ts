import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  get loggedIn() {
    return this.auth.loggedIn;
  }

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}
}
