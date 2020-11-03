import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GuestNotice } from './guest-notice.interface';

@Injectable({
  providedIn: 'root'
})
export class GuestNoticeService {
  onNoticeChanged$: BehaviorSubject<GuestNotice>;

  constructor() {
    this.onNoticeChanged$ = new BehaviorSubject(null);
  }

  setNotice(message: string, type?: string): void {
    if (type === 'info') {
      type = 'primary';
    }
    const notice: GuestNotice = {
      message,
      type: type ? type : 'primary'
    };
    this.onNoticeChanged$.next(notice);
  }
}
