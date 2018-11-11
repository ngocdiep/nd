import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NewComponent } from './new/new.component';
import { PostComponent } from './post/post.component';
import { PostsRoutingModule } from './posts-routing.module';
import { ListComponent } from './list/list.component';
import { QuillModule } from 'ngx-quill';
import { DetailComponent } from './detail/detail.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    QuillModule,
    PostsRoutingModule
  ],
  exports: [ListComponent],
  declarations: [PostComponent, NewComponent, ListComponent, DetailComponent]
})
export class PostsModule { }
