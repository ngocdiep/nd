import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { TokenService } from 'src/app/core/services/token.service';
import { User } from './user.model';

const registerPersonAndSignIn = gql`
mutation registerPersonAndSignIn($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
  registerPersonAndSignIn(input: {firstName: $firstName, lastName: $lastName, email: $email, password: $password}) {
    jwtToken
  }
}
`;

const authenticate = gql`
mutation authenticate($email: String!, $password: String!) {
  authenticate(input: {email: $email, password: $password}) {
    jwtToken
  }
}
`;

const currentUser = gql`
query {
  currentPerson {
    id,
    firstName,
    lastName,
    fullName,
    avatarUrl
  }
}
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();


  constructor(
    private apollo: Apollo,
    private tokenService: TokenService
  ) { }

  registerPersonAndSignIn(input: any) {
    return this.apollo.mutate({
      mutation: registerPersonAndSignIn,
      variables: {
        firstName: 'input.firstName',
        lastName: 'input.lastName',
        email: input.email,
        password: input.password
      }
    }).pipe(map(result => {
      if (result.data && result.data.registerPersonAndSignIn) {
        this.tokenService.saveToken(result.data.registerPersonAndSignIn.jwtToken);
        this.setCurrentUser();
      }
      return result;
    }));
  }

  authenticate(input: any) {
    this.clearAuth();
    return this.apollo.mutate({
      mutation: authenticate,
      variables: {
        email: input.email,
        password: input.password
      }
    }).pipe(map(result => {
      if (result.data.authenticate.jwtToken) {
        this.tokenService.saveToken(result.data.authenticate.jwtToken);
        this.setCurrentUser();
      }
      return result;
    }));
  }

  setAuth(user: User) {
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  setCurrentUser() {

    return this.apollo.query(
      {
        query: currentUser,
        fetchPolicy: 'no-cache'
      }
    ).subscribe(result => {
      if (result.data['currentPerson']) {
        const user = new User();
        user.firstName = result.data['currentPerson'].firstName;
        user.lastName = result.data['currentPerson'].lastName;
        user.id = result.data['currentPerson'].id;
        this.setAuth(user);
      }
    });
  }

  clearAuth() {
    this.currentUserSubject.next({} as User);
    this.isAuthenticatedSubject.next(false);
    this.tokenService.destroyToken();
  }

}
