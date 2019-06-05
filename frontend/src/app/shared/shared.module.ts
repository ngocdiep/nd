import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { CommentListComponent } from './comment-list/comment-list.component';
import { ShowAuthedDirective } from './directives';
import { EditInlineComponent } from './edit-inline/edit-inline.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HeaderComponent } from './layout/header/header.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SampleComponent } from './sample/sample.component';
import { LoadingComponent } from './loading/loading.component';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    QuillModule,
    TagInputModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    QuillModule,
    TagInputModule,
    ShowAuthedDirective,
    SafeHtmlPipe,
    LoadingComponent,
    HeaderComponent,
    FileUploadComponent,
    EditInlineComponent,
    CommentListComponent,
  ],
  declarations: [SampleComponent, HeaderComponent, ShowAuthedDirective, SafeHtmlPipe,
    FileUploadComponent, ErrorModalComponent, EditInlineComponent, CommentListComponent, LoadingComponent]
})
export class SharedModule { }
