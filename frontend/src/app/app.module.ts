import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { SampleComponent } from './shared/sample/sample.component';
import { SharedModule } from './shared/shared.module';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { CoreModule } from './core/core.module';


@NgModule({
  declarations: [
    AppComponent,
    PasswordResetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    CoreModule,
    SharedModule
  ],
  providers: [],
  entryComponents: [
    SampleComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
