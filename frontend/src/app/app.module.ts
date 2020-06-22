import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtAuthTokenInterceptor } from './jwt-auth-token.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { LoggerModule, NgxLoggerLevel, LoggerConfig } from 'ngx-logger';
import { RegisterComponent } from './register/register.component';


// A trick to enable logging in the production.
// Add ?debug to the production URL to enable logging
let logLevel = NgxLoggerLevel.ERROR;
if(window.location.href.includes("local") || window.location.href.includes("debug")) {
  console.log("Debug logging activated");
  logLevel = NgxLoggerLevel.DEBUG;
}

const loggerConfig: LoggerConfig = {
  level: logLevel,
};


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ClarityModule,
    BrowserAnimationsModule,
    LoggerModule.forRoot({
      level: logLevel
    }),
  ],
  providers:
  [
    { provide: HTTP_INTERCEPTORS, useClass: JwtAuthTokenInterceptor, multi: true },
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
