import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatDialogComponent} from './chat-dialog/chat-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatChipsModule} from '@angular/material';

import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [ChatDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatButtonModule
  ],
  exports: [ChatDialogComponent]
})
export class ChatModule { }
