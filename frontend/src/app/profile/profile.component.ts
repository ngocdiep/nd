import { Component, OnInit } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ProfileService } from './profile.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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

  processingSubject
    = new BehaviorSubject({ firstName: false, lastName: false, birthday: false });
  processing = this.processingSubject.asObservable().pipe(distinctUntilChanged());
  userProfile: Observable<UserProfile>;
  backendUrl: string;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.getUserProfile().subscribe(result => {
      this.userProfile = of(result.data['currentPerson'] as UserProfile);
    });

    this.backendUrl = environment.backend_url;
  }

  updateFirstName(firstName: string, editFirstName, firstNameInput) {
    const process = this.processingSubject.getValue();
    process.firstName = true;
    this.processingSubject.next(process);
    this.userProfile.subscribe(user => {
      if (user.firstName !== firstName) {
        this.update(user.id, { firstName: firstName })
          .subscribe(result => {
            process.firstName = false;
            this.processingSubject.next(process);
            firstNameInput.blur();
            editFirstName.value = false;
          });
      }
    });
  }

  resetFirstName(firstName: any) {
    this.userProfile.subscribe(user => {
      firstName.value = user.firstName;
    });
  }

  updateLastName(lastName: string) {
    const process = this.processingSubject.getValue();
    process.lastName = true;
    this.processingSubject.next(process);
    this.userProfile.subscribe(user => {
      if (user.lastName !== lastName) {
        this.update(user.id, { lastName: lastName }).subscribe(result => {
          process.lastName = false;
          this.processingSubject.next(process);
        });
      } else {
        process.lastName = false;
        this.processingSubject.next(process);
      }
    });
  }

  resetLastName(lastName: any) {
    this.userProfile.subscribe(user => {
      lastName.value = user.lastName;
    });
  }

  updateBirthday(birthday: Date) {
    const process = this.processingSubject.getValue();
    process.birthday = true;
    this.processingSubject.next(process);
    this.userProfile.subscribe(user => {
      if (user.birthday !== birthday) {
        this.update(user.id, { birthday: birthday }).subscribe(result => {
          process.lastName = false;
          this.processingSubject.next(process);
        });
      } else {
        process.birthday = false;
        this.processingSubject.next(process);
      }
    });
  }

  resetBirthday(birthday: any) {
    this.userProfile.subscribe(user => {
      birthday.value = user.birthday;
    });
  }

  update(userId: number, personPatch: any) {
    return this.profileService.update(+userId, personPatch);
  }

  onAvatarUploaded($event) {
    console.log($event);
    this.userProfile.subscribe(user => {
      user.avatarUrl = $event.data['updatePersonById'].person.avatarUrl;
      this.userProfile = of(user);
    });
  }
}
