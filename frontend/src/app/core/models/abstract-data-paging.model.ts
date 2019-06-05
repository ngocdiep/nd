export interface AbstractDataPaging<E> {
    loading?: boolean;
    data?: {
        edges: { node: E }[];
        totalCount?: number;
        pageInfo?: {
            hasNextPage?: boolean;
            startCursor?: string
            endCursor?: string
        };
    }
}
