import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { GraphQLModule } from './graphql.module';
import { ErrorModalComponent } from './shared/error-modal/error-modal.component';
import { SampleComponent } from './shared/sample/sample.component';
import { SharedModule } from './shared/shared.module';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    QuillModule.forRoot()
  ],
  providers: [],
  entryComponents: [
    SampleComponent,
    ErrorModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
