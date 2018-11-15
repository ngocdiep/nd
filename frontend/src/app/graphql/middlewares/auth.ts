import { GraphQLRequest } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { TokenService } from 'src/app/core';


function createAuthLink(tokenService: TokenService) {
    const authLink = setContext((operation: GraphQLRequest, prevContext: any) => {
        const jwt: string = tokenService.getToken();

        if (!jwt) {
            return {};
        } else {
            return {
                headers: { Authorization: `Bearer ${jwt}` }
            };
        }
    });
    return authLink;
}

export { createAuthLink };
