import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { QueryParams } from 'src/app/home/query-params';

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
    title
    content
    authorId
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
        authorId
        postTagsByPostId {
          nodes {
            tagByTagId {
              id
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


const getPageWithFilter = gql`
query ($offset: Int, $first: Int, $tags: [String]) {
  filterPostsByTags(offset: $offset, first: $first, tags: $tags) {
    edges {
      node {
        id
        title
        summary
        authorId
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

  getPage(queryParams: QueryParams) {
    if (queryParams.tag) {
      return this.apollo.query({
        query: getPageWithFilter,
        variables: { offset: queryParams.page * queryParams.limit, first: queryParams.limit, tags:  [queryParams.tag]},
        fetchPolicy: 'no-cache'
      });
    }
    return this.apollo.query({
      query: getPage,
      variables: { offset: queryParams.page * queryParams.limit, first: queryParams.limit },
      fetchPolicy: 'no-cache'
    });
  }

  getComments(postId: number, parentId: Number, offset: number, first: number, offsetReplies: number, firstReplies: number) {
    return this.apollo.query({
      query: gql`
        query ($postId: Int, $parentId: Int, $offset: Int, $first: Int, $offsetReplies: Int, $firstReplies: Int) {
          allPostComments(offset: $offset, first: $first, condition: {postId: $postId, parentId: $parentId}, orderBy: CREATED_AT_DESC) {
            totalCount
            pageInfo {
              hasNextPage
            }
            nodes {
              id
              content
              parentId
              authorId
              postCommentsByParentId(offset: $offsetReplies, first: $firstReplies, orderBy: CREATED_AT_DESC) {
                totalCount
                pageInfo {
                  hasNextPage
                }
                nodes {
                  id
                  content
                  parentId
                  authorId
                  postCommentsByParentId {
                    totalCount
                    pageInfo {
                      hasNextPage
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        postId: postId,
        parentId: parentId,
        offset: offset,
        first: first,
        offsetReplies: offsetReplies,
        firstReplies: firstReplies
      }
    });
  }

  addComment(authorId: number, postId: number, input: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation($authorId: Int!, $postId: Int!, $content: String!) {
          createPostComment(input: {postComment: {authorId: $authorId, postId: $postId, content: $content}}) {
            postComment {
              id
            }
          }
        }
      `,
      variables: {
        content: input.content,
        authorId: authorId,
        postId: postId
      }
    }).pipe(map(result => {
      return result;
    }));
  }


  addReply(authorId: number, postId: number, parentId: number, input: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($authorId: Int!, $postId: Int!, $parentId: Int, $content: String!) {
          createPostComment(input: {postComment: {authorId: $authorId, postId: $postId, parentId: $parentId, content: $content}}) {
            postComment {
              id
            }
          }
        }
      `,
      variables: {
        content: input.content,
        authorId: authorId,
        postId: postId,
        parentId: parentId
      }
    }).pipe(map(result => {
      return result;
    }));
  }
}
