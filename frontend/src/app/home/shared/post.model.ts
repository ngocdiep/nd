export interface Post {
    id: number;
    title: string;
    summary: string;
    postTagsByPostId: {
        nodes: {
            tagByTagId: {
                name: string
            }
        }
    };
}
