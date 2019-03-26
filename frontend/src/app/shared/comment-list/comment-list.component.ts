import { Component, OnInit, Input } from '@angular/core';
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
  comments: [any];
  @Input()
  postId: number;
  form: FormGroup;

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

  addReply(commentId: number) {
    this.postService.addReply(this.authService.currentUserSubject.getValue().id, this.postId, commentId, this.form.value)
      .subscribe(result => {
        console.log(result);
      });
  }
}
