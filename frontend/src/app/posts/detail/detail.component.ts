import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PostService } from '../shared/post.service';

export interface PostView {
  title: string;
  content: string;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  postView: Observable<PostView>;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params['id']);
      this.postService.get(params['id']).subscribe(result => {
        this.postView = of({
          title: result.data['postById'].title,
          content: result.data['postById'].content
        });
      });
    });
  }

}
