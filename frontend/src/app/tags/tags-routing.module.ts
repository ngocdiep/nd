import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TagsComponent } from './tags.component';
import { TagDetailComponent } from './tag-detail/tag-detail.component';

const routes: Routes = [
  {
    path: '',
    component: TagsComponent
  },
  {
    path: ':name',
    component: TagDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagsRoutingModule { }
