import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER,
  TuiButtonModule, TuiLoaderModule, TuiErrorModule,
} from '@taiga-ui/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { TableModule } from 'ngx-easy-table';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { PersonComponent } from './home/person/person.component';
import { CreateEditPersonComponent } from './components/create-edit-person/create-edit-person.component';
import {
  TuiCheckboxLabeledModule,
  TuiCheckboxModule, TuiDataListWrapperModule, TuiFieldErrorPipeModule,
  TuiInputModule, TuiInputNumberModule, TuiInputPhoneModule,
  TuiRadioModule,
  TuiSelectModule
} from "@taiga-ui/kit";
import {ReactiveFormsModule} from "@angular/forms";
@NgModule({
  declarations: [AppComponent, PersonComponent, CreateEditPersonComponent],
  imports: [
    BrowserModule,
    TableModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    TuiRootModule,
    TuiTablePaginationModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiButtonModule,
    TuiDialogModule,
    AppRoutingModule,
    TuiInputModule,
    ReactiveFormsModule,
    TuiRadioModule,
    TuiCheckboxModule,
    TuiCheckboxLabeledModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiLoaderModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputNumberModule,
    TuiInputPhoneModule,
  ],
  entryComponents: [CreateEditPersonComponent],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule {}
