import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(
    private apollo: Apollo,
  ) { }

  filter(pattern: string) {
    return this.apollo.query({
      query: gql`
      query {
        allTags {
          nodes {
            id
            name
          }
        }
      }`,
      fetchPolicy: 'no-cache'
    });
  }
}
