import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PostService } from '../shared/post.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/shared/auth.service';

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
  postId: number;
  form: FormGroup;
  comments = [];
  getCommentsParam = {offset: 0, first: 3};

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.postId = +params['id'];
      this.postService.get(this.postId).subscribe(result => {
        this.postView = of({
          title: result.data['postById'].title,
          content: result.data['postById'].content
        });
      });
    });

    this.postService.getComments(this.postId, this.getCommentsParam.offset, this.getCommentsParam.first).subscribe(
      result => {
        this.comments = result.data['postById'].postCommentsByPostId.edges;
      }
    );

    this.form = this.formBuilder.group({
      content: ['', [Validators.required]],
    });
  }

  onSubmit() {
    console.log(this.form.get('content'));
    this.postService.addComment(this.postId, this.authService.currentUserSubject.getValue().id, this.form.value)
      .subscribe(result => {
        console.log(result);
      });
  }
}
