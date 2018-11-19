import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProfileService } from './profile.service';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  birthday: Date;
  avatarUrl: string;
  about: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private userProfile: Observable<UserProfile>;
  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.getUserProfile().subscribe(result => {
      this.userProfile = of(result.data['currentPerson'] as UserProfile);
    });
  }

}
