import { NgModule } from '@angular/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { TokenService } from './core';
import { createAuthLink } from './graphql/middlewares/auth';
import { ModalService } from './core/services/modal.service';
import { createErrorLink } from './graphql/middlewares/error';

const uri = 'http://localhost:5000/graphql'; // <-- add the URL of the GraphQL server here
// const uri = '/graphql';

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
})
export class GraphQLModule {
  constructor(
    private apollo: Apollo,
    private tokenService: TokenService,
    private modalService: ModalService
  ) {
    const uploadLink = createUploadLink({ uri: uri });
    const authLink = createAuthLink(tokenService);
    const errorLink = createErrorLink(modalService);
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
