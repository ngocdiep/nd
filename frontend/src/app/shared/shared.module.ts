import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShowAuthedDirective } from './directives';
import { HeaderComponent } from './layout/header/header.component';
import { SampleComponent } from './sample/sample.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

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
    SafeHtmlPipe,
    HeaderComponent
  ],
  declarations: [SampleComponent, HeaderComponent, ShowAuthedDirective, SafeHtmlPipe]
})
export class SharedModule { }
