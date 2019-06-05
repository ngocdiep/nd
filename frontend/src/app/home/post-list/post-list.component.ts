import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { PostList } from '../shared';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  @Input() postList: PostList;
  constructor() { }

  ngOnInit() {
    console.log('data: ', this.postList);
  }

}
