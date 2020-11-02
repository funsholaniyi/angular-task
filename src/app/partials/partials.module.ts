import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { GuestNoticeComponent } from './guest-notice/guest-notice.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [HeaderComponent, FooterComponent, GuestNoticeComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent, FooterComponent, GuestNoticeComponent
  ]
})
export class PartialsModule {
}
