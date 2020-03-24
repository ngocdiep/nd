import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Paging } from '../core';
import { PostService } from '../posts/shared/post.service';
import { PostList } from './shared';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

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

  formFilter: FormGroup = new FormGroup({
    filteredTags: new FormControl([]),
  });

  postList: PostList = {};

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    if (localStorage.getItem('filteredTags')) {
      this.filteredTagsFC.setValue(JSON.parse(localStorage.getItem('filteredTags')));
    }

    this.getPosts();
    this.activatedRoute.queryParams.subscribe(p => {
      console.log(p);
    });
    this.filteredTagsFC.valueChanges.subscribe(filteredTags => {
      localStorage.setItem('filteredTags', JSON.stringify(filteredTags));
      this.getPosts();
    });
  }

  get filteredTags() {
    let filteredTags: { display: string; value: string }[] = this.filteredTagsFC.value;

    let tags = [];

    filteredTags.forEach(tag => {
      tags.push(tag.value);
    });

    return tags;
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
      this.postService.getPage(this.filteredTags, this.paging).pipe(
        finalize(() => this.postList.loading = false)
      ).subscribe(result => {
        this.postList.data = result.data['allPosts'];
      });
    }
  }

  onTagSelected(tag: string) {
    let filteredTags: { display: string; value: string }[] = this.filteredTagsFC.value;
    let isExisted = false;
    filteredTags.forEach(tagInput => {
      if (tagInput.value === tag) {
        isExisted = true;
        return;
      }
    });
    if (!isExisted) {
      let filteredTag = this.filteredTagsFC.value;
      filteredTag.push({ display: tag, value: tag });
      this.filteredTagsFC.setValue(filteredTag);
    }
  }

  onTagFilterSelected(tag: string) {
    let filteredTags: { display: string; value: string }[] = this.filteredTagsFC.value;
    let isExisted = false;
    filteredTags.forEach(tagInput => {
      if (tagInput.value === tag) {
        isExisted = true;
        return;
      }
    });
    if (!isExisted) {
      let filteredTag = this.filteredTagsFC.value;
      filteredTag.push({ display: tag, value: tag });
      this.filteredTagsFC.setValue(filteredTag);
    }
  }

  private get filteredTagsFC() { return this.formFilter.get('filteredTags') }
}
