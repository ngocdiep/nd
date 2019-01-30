import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { PostService } from '../shared/post.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, OnDestroy {
  authorId: number;
  form: FormGroup;
  errors: string[] = [];
  @ViewChild('contentInput') contentInput: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private postService: PostService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      tags: [[], [Validators.required]],
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });

    this.authService.currentUser.subscribe(user => {
      this.authorId = user.id;
      console.log('authorId: ', this.authorId);
    });
  }

  ngOnDestroy(): void {
    console.log('bye');
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.resetStatus();
    this.postService.createPost(this.form.value, this.contentInput['editorElem'].innerText.substring(0, 230), this.authorId).subscribe(
      result => {
        if (!result.errors) {
          this.router.navigateByUrl('');
        } else {
          (<Array<any>>result.errors).map(err => {
            this.errors.push(err.message);
          });
        }
      },
      err => {
        console.log(err);
      });
  }

  resetStatus() {
    this.errors = [];
  }

  hasError() {
    return this.errors.length > 0;
  }


}
