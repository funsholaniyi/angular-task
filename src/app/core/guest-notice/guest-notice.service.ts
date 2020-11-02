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

  /**
   * Set the notice value
   * @param message
   * @param type
   */
  setNotice(message: string, type?: string) {
    if (type === 'info') {
      type = 'primary';
    }
    const notice: GuestNotice = {
      message: message,
      type: type ? type : 'primary'
    };
    this.onNoticeChanged$.next(notice);
  }
}
