import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
const { createUploadLink } = require('apollo-upload-client');

const uri = 'http://localhost:5000/graphql'; // <-- add the URL of the GraphQL server here

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

export function createApollo(httpLink: HttpLink) {
  const uploadLink = createUploadLink();
  return {
    link: ApolloLink.from([errorLink, httpLink.create({ uri }), uploadLink]),
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
      mutate: {
        errorPolicy: 'all'
      },
      query: {
        errorPolicy: 'all'
      },
      watchQuery: {
        errorPolicy: 'all'
      }
    }
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }
