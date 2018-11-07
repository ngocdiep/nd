import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { TokenService } from 'src/app/core';
import { UserService } from 'src/app/auth/shared/user.service';
import { map } from 'rxjs/operators';

const createPost = gql`
mutation ($headline: String!, $body: String, $authorId: Int!) {
  createPost(input: {post: {headline: $headline, body: $body, authorId: $authorId}}) {
    post {
      id
    }
  }
}
`;

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private apollo: Apollo,
    private userService: UserService
  ) { }

  createPost(input: any, authorId: number) {
    return this.apollo.mutate({
      mutation: createPost,
      variables: {
        headline: input.title,
        body: input.content,
        authorId: authorId
      }
    }).pipe(map(result => {
      return result;
    }));
  }
}
