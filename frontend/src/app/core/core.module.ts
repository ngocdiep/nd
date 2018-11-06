import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthGuard, UnAuthGuard } from './guards';
import { DefaultInterceptor } from './interceptors';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    UnAuthGuard,
    AuthGuard
  ],
})
export class CoreModule { }
