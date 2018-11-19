import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const getUserProfile = gql`
  query {
  currentPerson {
    id
    firstName
    lastName
    birthday
    avatarUrl
    about
  }
}
`;

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private apollo: Apollo
  ) { }

  getUserProfile() {
    return this.apollo.query({
      query: getUserProfile
    });
  }
}


