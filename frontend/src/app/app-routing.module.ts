import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsModule } from './posts/posts.module';
import { HomeModule } from './home/home.module';
import { AuthModule } from './auth/auth.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => HomeModule
  },
  {
    path: 'auth',
    loadChildren: () => AuthModule
  },
  {
    path: 'post',
    loadChildren: () => PostsModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
