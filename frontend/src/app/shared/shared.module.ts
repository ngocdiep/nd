import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShowAuthedDirective } from './directives';
import { HeaderComponent } from './layout/header/header.component';
import { SampleComponent } from './sample/sample.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ShowAuthedDirective,
    HeaderComponent
  ],
  declarations: [SampleComponent, HeaderComponent, ShowAuthedDirective]
})
export class SharedModule { }
