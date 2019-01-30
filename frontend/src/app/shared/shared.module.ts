import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShowAuthedDirective } from './directives';
import { HeaderComponent } from './layout/header/header.component';
import { SampleComponent } from './sample/sample.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { EditInlineComponent } from './edit-inline/edit-inline.component';
import { TreeModule } from 'angular-tree-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TreeModule.forRoot()
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TreeModule,
    ShowAuthedDirective,
    SafeHtmlPipe,
    HeaderComponent,
    FileUploadComponent,
    EditInlineComponent
  ],
  declarations: [SampleComponent, HeaderComponent, ShowAuthedDirective, SafeHtmlPipe,
    FileUploadComponent, ErrorModalComponent, EditInlineComponent]
})
export class SharedModule { }
