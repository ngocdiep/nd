import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { SampleComponent } from './sample/sample.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent
  ],
  declarations: [SampleComponent, HeaderComponent]
})
export class SharedModule { }
