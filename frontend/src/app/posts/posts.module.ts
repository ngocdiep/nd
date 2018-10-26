import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { PostComponent } from './post/post.component';
import { NewComponent } from './new/new.component';

@NgModule({
  imports: [
    CommonModule,
    PostsRoutingModule
  ],
  declarations: [PostComponent, NewComponent]
})
export class PostsModule { }
