import { NgModule } from '@angular/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { TokenService } from './core';
import { createAuthLink } from './graphql/middlewares/auth';

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

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
})
export class GraphQLModule {
  constructor(apollo: Apollo, tokenService: TokenService) {
    const uploadLink = createUploadLink({ uri: uri });
    const authLink = createAuthLink(tokenService);
    apollo.create({
      link: ApolloLink.from([authLink, errorLink, uploadLink]),
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
    });
  }
}
