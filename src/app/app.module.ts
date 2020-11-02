import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { VideoEditComponent } from './pages/video-edit/video-edit.component';
import { VideoListComponent } from './pages/video-list/video-list.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoEditComponent,
    VideoListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
