import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Paging } from '../core';
import { PostService } from '../posts/shared/post.service';
import { PostList } from './shared';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  paging: Paging = {
    offset: 0,
    first: 10
  };

  filteredTags: string[] = [];

  postList: PostList = {};

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getPosts();
    this.activatedRoute.params.subscribe(p => {
      console.log(p);
    });
  }

  getPosts() {
    this.postList.loading = true;
    if (this.filteredTags.length > 0) {
      this.postService.getPage(this.filteredTags, this.paging).pipe(
        finalize(() => this.postList.loading = false)
      ).subscribe(result => {
        this.postList.data = result.data['filterPostsByTags'];
      });
    } else {
      this.postService.getPage([], this.paging).pipe(
        finalize(() => this.postList.loading = false)
      ).subscribe(result => {
        this.postList.data = result.data['allPosts'];
      });
    }
  }

  onTagsAdded(filteredTags) {
    this.filteredTags = filteredTags;
    this.getPosts();
  }

}
