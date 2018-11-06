import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/shared/user.service';
import { TokenService } from 'src/app/core';


export class SearchForm {
  constructor(public searchString: string) { }
}


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuthenticated = false;
  model: SearchForm = new SearchForm('');

  constructor(
    private authService: UserService,
    private router: Router,
    private tokenService: TokenService) {
  }

  ngOnInit() {
    this.authService.isAuthenticated.subscribe(rs => this.isAuthenticated = rs);
  }

  onSubmit() {
    console.log('searchString: ' + this.model.searchString);
    this.router.navigateByUrl('/search/' + this.model.searchString);
  }

  onLogOut() {
    this.authService.logOut();
  }
}
