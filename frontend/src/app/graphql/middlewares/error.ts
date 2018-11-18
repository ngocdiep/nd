import { onError } from 'apollo-link-error';
import { ModalService } from 'src/app/core/services/modal.service';
import { ErrorModalComponent } from 'src/app/shared/error-modal/error-modal.component';

function createErrorLink(modalService: ModalService) {
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
            const inputs = {
                isMobile: false
            };
            // modalService.init(ErrorModalComponent, inputs, {});
        }
    });

    return errorLink;
}

export { createErrorLink };
