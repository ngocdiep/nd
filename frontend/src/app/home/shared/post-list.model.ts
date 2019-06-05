import { Post } from './post.model';
import { AbstractDataPaging } from 'src/app/core';

export interface PostList extends AbstractDataPaging<Post> {

}
