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

const updateProfile = gql`
  mutation ($id: Int!, $personPatch: PersonPatch!) {
  updatePersonById(input: {id: $id, personPatch: $personPatch}) {
    person {
      updatedAt
    }
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

  update(id: number, personPatch: any) {
    return this.apollo.mutate({
      mutation: updateProfile,
      variables: {
        id: id,
        personPatch: personPatch
      }
    });
  }

}


