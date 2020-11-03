import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { VideoEditComponent } from './pages/video-edit/video-edit.component';
import { VideoListComponent } from './pages/video-list/video-list.component';
import { PartialsModule } from './partials/partials.module';

const routes: Routes = [
  {
    path: 'videos',
    component: VideoListComponent
  },
  {
    path: 'videos/add',
    component: VideoEditComponent
  },
  {
    path: 'videos/:id/edit',
    component: VideoEditComponent
  },
  {path: '', redirectTo: 'videos', pathMatch: 'full'},
  {path: '**', redirectTo: 'error', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    VideoEditComponent,
    VideoListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    PartialsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
