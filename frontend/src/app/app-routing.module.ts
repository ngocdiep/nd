import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PostsModule } from './posts/posts.module';

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
    path: 'password-reset',
    component: PasswordResetComponent
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
