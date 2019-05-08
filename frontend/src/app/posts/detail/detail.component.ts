import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/auth/shared/auth.service';
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
  postId: number;
  form: FormGroup;
  comments: { totalCount: number, pageInfo: { hasNextPage: boolean }, nodes: any[] };
  getCommentsParam = { offset: 0, first: 3 };

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

    this.postService.getComments(this.postId, null, this.getCommentsParam.offset, this.getCommentsParam.first, 0, 1).subscribe(
      result => {
        this.comments = result.data['allPostComments'];
      }
    );

    this.form = this.formBuilder.group({
      content: ['', [Validators.required]],
    });
  }

  addComment() {
    this.postService.addComment(this.authService.currentUserSubject.getValue().id, this.postId, this.form.value)
      .subscribe(result => {
        this.comments.nodes.splice(0, 0, {
          id: result.data.createPostComment.postComment.id, content: this.form.value.content, parentId: null, postCommentsByParentId: {
            totalCount: 0,
            pageInfo: {
              hasNextPage: false,
            }, nodes: []
          }
        });
        this.comments.totalCount += 1;
        this.form.controls.content.setValue(null);
      });
  }

  showMoreComments(parentId: number, nextOffset: number) {
    this.postService.getComments(this.postId, parentId, nextOffset, 3, 0, 1).subscribe(
      result => {
        const moreNodes: any[] = result.data['allPostComments'].nodes;
        this.comments.nodes.push(...moreNodes);
        this.comments.pageInfo = result.data['allPostComments'].pageInfo;
      }
    );
  }
}
