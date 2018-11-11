import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PostsModule } from '../posts/posts.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    PostsModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
