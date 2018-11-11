import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

export interface PostListPaging {
  edges: [{
    node: {
      id: number;
      title: string;
      summary: string
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
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Input() postListPaging: PostListPaging;
  constructor() { }

  ngOnInit() {
    console.log('data: ', this.postListPaging);
  }

}
