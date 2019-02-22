import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

export interface PostListPaging {
  edges: [{
    node: {
      id: number;
      title: string;
      summary: string;
      postTagsByPostId: {
        nodes: {
          tagByTagId: {
            name: string
          }
        }
      }
    }
  }];
  totalCount: number;
  pageInfo: {
    hasNextPage
    startCursor
    endCursor
  };
}

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  @Input() postListPaging: PostListPaging;
  constructor() { }

  ngOnInit() {
    console.log('data: ', this.postListPaging);
  }

}
