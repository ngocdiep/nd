import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../shared/shared.module';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { PostsRoutingModule } from './posts-routing.module';

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
  declarations: [NewComponent, ListComponent, DetailComponent]
})
export class PostsModule { }
