import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PostListComponent } from './post-list/post-list.component';
import { TagListComponent } from './post-list/tag-list/tag-list.component';
import { TagsComponent } from './tags/tags.component';


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
  ],
  declarations: [HomeComponent, PostListComponent, TagListComponent, TagsComponent]
})
export class HomeModule { }
