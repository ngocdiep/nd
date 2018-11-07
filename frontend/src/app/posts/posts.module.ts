import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NewComponent } from './new/new.component';
import { PostComponent } from './post/post.component';
import { PostsRoutingModule } from './posts-routing.module';
import { ListComponent } from './list/list.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PostsRoutingModule
  ],
  declarations: [PostComponent, NewComponent, ListComponent]
})
export class PostsModule { }
