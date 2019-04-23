import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostService } from 'src/app/posts/shared/post.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  @Input()
  comments: { totalCount: number, pageInfo: { hasNextPage: boolean }, nodes: [any] };
  @Input()
  postId: number;
  @Input()
  currentOffset: number;

  form: FormGroup;
  showReply = {};
  @Output()
  getMoreComments = new EventEmitter<any>();

  constructor(
    private postService: PostService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      content: ['', [Validators.required]],
    });
  }

  showReplyForm(id: number) {
    this.showReply[id] = !this.showReply[id];
  }

  addReply(nodes: any[], commentId: number) {
    this.postService.addReply(this.authService.currentUserSubject.getValue().id, this.postId, commentId, this.form.value)
      .subscribe(result => {
        console.log(result);
        nodes.push({
          id: result.data.createPostComment.postComment.id, content: this.form.value, parentId: commentId,
          postCommentsByParentId: {
            totalCount: 0,
            pageInfo: {
              hasNextPage: true,
            }, nodes: []
          }
        });
      });
  }

  showMoreComments2(p: any, parentId: number, nextOffset: number) {
    this.postService.getComments(this.postId, parentId, nextOffset, 3, 0, 1).subscribe(
      result => {
        const a: [any] = result.data['allPostComments'].nodes;
        if (p.postCommentsByParentId.nodes) {
          p.postCommentsByParentId.nodes.push(...a);
        } else {
          p.postCommentsByParentId.nodes = a;
        }
        p.postCommentsByParentId.pageInfo = result.data['allPostComments'].pageInfo;
        console.log(this.comments.nodes.length);
      }
    );
  }
}
