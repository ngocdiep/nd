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
  comments: {totalCount: number, pageInfo: {hasNextPage: boolean}, nodes: [any]};
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

  addReply(commentId: number) {
    this.postService.addReply(this.authService.currentUserSubject.getValue().id, this.postId, commentId, this.form.value)
      .subscribe(result => {
        console.log(result);
      });
  }

  showMoreComments(parentId: number) {
    this.currentOffset += 3;
    this.postService.getComments(this.postId, parentId, this.currentOffset, 3, 0, 1).subscribe(
      result => {
        const a: [any] = result.data['allPostComments'].nodes;
        this.comments.nodes.push(...a);
        console.log(this.comments.nodes.length);
      }
    );
  }
}
