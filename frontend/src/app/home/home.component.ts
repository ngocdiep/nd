import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { PostService } from '../posts/shared/post.service';
import { QueryParams } from './query-params';
import { PostList } from './shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  queryParams: QueryParams = {
    page: 0,
    limit: 10
  };

  formFilter: FormGroup = new FormGroup({
    filteredTag: new FormControl(),
  });

  postList: PostList = {};

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(p => {
      this.queryParams = p;
      this.getPosts();
    });
  }


  getPosts() {
    this.postList.loading = true;
    if (this.queryParams.tag) {
      this.postService.getPage(this.queryParams).pipe(
        finalize(() => this.postList.loading = false)
      ).subscribe(result => {
        this.postList.data = result.data['filterPostsByTags'];
      });
    } else {
      this.postService.getPage(this.queryParams).pipe(
        finalize(() => this.postList.loading = false)
      ).subscribe(result => {
        this.postList.data = result.data['allPosts'];
      });
    }
  }

}
