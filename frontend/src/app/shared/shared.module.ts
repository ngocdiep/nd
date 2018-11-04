import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { SampleComponent } from './sample/sample.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent
  ],
  declarations: [SampleComponent, HeaderComponent]
})
export class SharedModule { }
