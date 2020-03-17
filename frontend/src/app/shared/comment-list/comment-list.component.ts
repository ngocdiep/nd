import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { PostService } from 'src/app/posts/shared/post.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  @Input()
  comments: { totalCount: number, pageInfo: { hasNextPage: boolean }, nodes: any[] };
  @Input()
  postId: number;
  @Input()
  currentOffset: number;

  form = {};
  showReply = {};
  @Output()
  getMoreComments = new EventEmitter<any>();

  constructor(
    private postService: PostService,
    private formBuilder: FormBuilder,
    public authService: AuthService,
  ) { }

  ngOnInit() {
  }

  showReplyForm(id: number) {
    this.showReply[id] = !this.showReply[id];
    if (this.showReply[id]) {
      if (!this.form[id]) {
        this.form[id] = this.formBuilder.group({
          content: ['', [Validators.required]],
        });
      }

      setTimeout(() => {
        const replyInput = document.getElementById('reply-' + id).querySelector('.ql-container').querySelector('.ql-editor');
        (replyInput as HTMLElement).focus();
      }, 300);
    }
  }

  addReply(parentComment: any, commentId: number) {
    this.postService.addReply(this.authService.currentUserSubject.getValue().id, this.postId, commentId, this.form[commentId].value)
      .subscribe(result => {
        const newReply = {
          id: result.data['createPostComment'].postComment.id, content: this.form[commentId].value.content, parentId: commentId,
          postCommentsByParentId: {
            totalCount: 0,
            pageInfo: {
              hasNextPage: false,
            }, nodes: []
          }
        };
        if (parentComment.nodes) {
          parentComment.nodes.splice(0, 0, newReply);
        } else {
          parentComment.nodes = [newReply];
        }
        parentComment.totalCount += 1;

        this.form[commentId].controls.content.setValue(null);
      });
  }

  showMoreReplies(parentComment: any, parentId: number, nextOffset: number) {
    this.postService.getComments(this.postId, parentId, nextOffset, 3, 0, 1).subscribe(
      result => {
        const moreNodes: [any] = result.data['allPostComments'].nodes;
        if (parentComment.nodes) {
          parentComment.nodes.push(...moreNodes);
        } else {
          parentComment.nodes = moreNodes;
        }
        parentComment.pageInfo = result.data['allPostComments'].pageInfo;
      }
    );
  }
}
