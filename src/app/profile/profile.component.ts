import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile: any;

  get isProfileLoaded() {
    return this.profile !== undefined;
  }

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.userProfile$.subscribe((profile) => this.dataLoaded(profile));
  }

  private dataLoaded(profile: any): void {
    this.profile = profile;
  }
}
