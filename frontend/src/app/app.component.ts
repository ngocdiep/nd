import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'frontend';
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.setCurrentUser();
  }

  removeModal() {
  }
}
