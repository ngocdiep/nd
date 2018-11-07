import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostComponent } from './post/post.component';
import { NewComponent } from './new/new.component';

const routes: Routes = [
  {
    path: 'create',
    component: NewComponent
  },
  {
    path: '',
    component: PostComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
