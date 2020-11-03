import { ChangeDetectorRef, Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { GuestNotice } from '../../core/guest-notice/guest-notice.interface';
import { GuestNoticeService } from '../../core/guest-notice/guest-notice.service';

@Component({
  selector: 'app-guest-notice',
  templateUrl: './guest-notice.component.html'
})
export class GuestNoticeComponent implements OnInit, OnDestroy {
  @Output() type: any;
  @Output() message: any = '';
  hide = false;

  private subscriptions: Subscription[] = [];

  constructor(
    public guestNoticeService: GuestNoticeService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.guestNoticeService.onNoticeChanged$.subscribe(
        (notice: GuestNotice) => {
          notice = Object.assign(
            {},
            {message: '', type: ''},
            notice
          );
          this.message = notice.message;
          this.type = notice.type;
          this.hide = false;
          this.cdr.markForCheck();
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  hideAlert(): void {
    this.hide = true;
  }
}
