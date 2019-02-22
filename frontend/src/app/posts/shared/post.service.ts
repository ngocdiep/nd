import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { TokenService } from 'src/app/core';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { map } from 'rxjs/operators';

const createPost = gql`
mutation ($title: String!, $content: String, $summary: String, $authorId: Int!, $tags: [String!]!) {
  createPostWithTags(input: {post: {title: $title, content: $content, summary: $summary, authorId: $authorId}, tags: $tags}) {
    post {
      id
    }
  }
}
`;

const getById = gql`
query($id: Int!) {
  postById(id: $id) {
    title,
    content
  }
}
`;

const getPage = gql`
query ($offset: Int, $first: Int) {
  allPosts(offset: $offset, first: $first) {
    edges {
      node {
        id
        title
        summary
        postTagsByPostId {
          nodes {
            tagByTagId {
              name
            }
          }
        }
      }
    }
    totalCount
    pageInfo {
      hasNextPage
      startCursor
      endCursor
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
    private authService: AuthService
  ) { }

  createPost(input: any, summary: string, authorId: number) {
    const tags = [];
    input.tags.forEach(tag => {
      tags.push(tag.value);
    });
    return this.apollo.mutate({
      mutation: createPost,
      variables: {
        title: input.title,
        content: input.content,
        summary: summary,
        authorId: authorId,
        tags: tags
      }
    }).pipe(map(result => {
      return result;
    }));
  }

  get(id: number) {
    return this.apollo.query({
      query: getById,
      variables: { id: id }
    });
  }

  getPage(paging) {
    return this.apollo.query({
      query: getPage,
      variables: { offset: paging.offset, first: paging.first },
      fetchPolicy: 'no-cache'
    });
  }
}
