import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import {TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER, TuiButtonModule} from "@taiga-ui/core";
import {TuiTablePaginationModule} from '@taiga-ui/addon-table';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { TableModule } from 'ngx-easy-table';
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, TableModule, HttpClientModule, BrowserAnimationsModule ,RouterModule, TuiRootModule,TuiTablePaginationModule, TuiDialogModule, TuiAlertModule, TuiButtonModule],
  providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}],
  bootstrap: [AppComponent],
})
export class AppModule {}
