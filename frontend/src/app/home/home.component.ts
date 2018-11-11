import { Component, OnInit } from '@angular/core';
import { PostListPaging } from '../posts/list/list.component';
import { PostService } from '../posts/shared/post.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  paging = {
    offset: 0,
    first: 5
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
