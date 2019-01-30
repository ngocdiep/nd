import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostCategoryRoutingModule } from './post-category-routing.module';
import { PostCategoryComponent } from './post-category.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PostCategoryComponent],
  imports: [
    CommonModule,
    PostCategoryRoutingModule,
    SharedModule
  ]
})
export class PostCategoryModule { }
