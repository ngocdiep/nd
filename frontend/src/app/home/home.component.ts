import { Component, OnInit } from '@angular/core';
import { PostService } from '../posts/shared/post.service';
import { PostListPaging } from './post-list/post-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  paging = {
    offset: 0,
    first: 50
  };
  postListPaging: PostListPaging;
  constructor(private postService: PostService) {
    this.postService.getPage(this.paging).subscribe(result => {
      this.postListPaging = result.data['allPosts'];
    });

  }

  ngOnInit() {

  }

}
