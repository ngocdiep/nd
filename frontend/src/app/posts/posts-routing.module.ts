import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostComponent } from './post/post.component';
import { NewComponent } from './new/new.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: 'create',
    component: NewComponent
  },
  {
    path: ':id',
    component: DetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
