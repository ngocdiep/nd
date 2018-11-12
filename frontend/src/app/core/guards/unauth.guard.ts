import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/shared/auth.service';

/* This guard is used to prevent enter a link that only available for the user has not logged in yet.
For example: if user aready logged in, use this guard to prevent user access to /login, /register,
/changepassword page and redirect to home page. */
@Injectable()
export class UnAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(take(1), map(isAuthenticated => !isAuthenticated));
  }
}
