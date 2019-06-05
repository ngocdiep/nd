import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagsRoutingModule } from './tags-routing.module';
import { TagsComponent } from './tags.component';
import { TagDetailComponent } from './tag-detail/tag-detail.component';

@NgModule({
  declarations: [TagsComponent, TagDetailComponent],
  imports: [
    CommonModule,
    TagsRoutingModule
  ]
})
export class TagsModule { }
