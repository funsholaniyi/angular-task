import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthorModel } from '../../core/author/_models/author.model';
import { FormatModel, VideoModel } from '../../core/author/_models/video.model';
import { AuthorService } from '../../core/author/_services/author.service';
import { CategoryModel } from '../../core/category/_models/category.model';
import { CategoryService } from '../../core/category/_services/category.service';
import { GuestNoticeService } from '../../core/guest-notice/guest-notice.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {
  authorList: AuthorModel[];
  categoryList: CategoryModel[];

  videoList: VideoModel[];
  filteredList: VideoModel[] = [];
  sortAsc = true;

  constructor(private authorService: AuthorService, private categoryService: CategoryService, private guestNoticeService: GuestNoticeService
  ) {
  }

  ngOnInit(): void {
    this.getVideos();
    this.getCategories();


  }

  getCategories(): void {
    this.categoryService.getCategories().pipe(tap(categories => {
      if (categories) {
        // save the category, to be used later
        this.categoryList = categories;
      }
    }), catchError(error => {
      const message = 'An error occurred trying to get categories';
      this.guestNoticeService.setNotice(message, 'danger');
      return of(error);
    })).subscribe();
  }

  getVideos(): void {
    this.authorService.getAuthors().pipe(
      tap((authors) => {
        if (authors.length) {
          this.videoList = this.authorService.convertAuthorModelToVideoModel(authors);
          this.filteredList = Array.from(this.videoList);
        }
      }),
      catchError(error => {
        const message = 'An error occurred trying to get videos';
        this.guestNoticeService.setNotice(message, 'danger');
        return of(error);
      })).subscribe();
  }

  getCategoryName(catIds: number[]): string {
    if (!catIds.length || !this.categoryList?.length) {
      return '';
    }
    // with each id, find its object in the category list, extract the name, then join into string
    return catIds.map(id =>
      this.categoryList.find(category =>
        category.id === id).name)
      .join(', ');
  }


  getHighestQuality(formats: FormatModel): any {
    let highest = 0;
    let highestSize = 0;
    let highestKey = '';
    Object.keys(formats).forEach((key) => {
      const obj = formats[key];
      const resInt = parseInt(obj.res.slice(0, -1), 10);
      if (resInt > highest) {
        highest = resInt;
        highestSize = obj.size;
        highestKey = key;
      } else if (resInt === highest && obj.size > highestSize) {
        highest = resInt;
        highestSize = obj.size;
        highestKey = key;
      }
    });

    return {highest, highestSize, highestKey, text: highestKey + ' ' + highest.toString() + 'p'};
  }


  searchList(event: any): void {
    const search = event.target.value.toLowerCase();
    const copiedList = Array.from(this.videoList);

    if (search.length < 2) {
      this.filteredList = copiedList;
    }

    this.filteredList = copiedList.filter(video => {
      return (video.name.toLowerCase().includes(search) || video.authorName.toLowerCase().includes(search));
    });

  }


  sortColumn(columnName: string): void {
    this.filteredList.sort((a, b) => {
      return this.sortAsc ? a[columnName].localeCompare(b[columnName]) : b[columnName].localeCompare(a[columnName]);
    });
    this.sortAsc = !this.sortAsc;

  }

  deleteVideo(video: VideoModel): void {
    if (confirm('Are you sure to delete ' + video.name + '. All entries from the author will be lost.')) {
      this.authorService.deleteAuthor(video.authorId).subscribe(() => {
        this.getVideos();
        const message = 'Video successfully deleted';
        this.guestNoticeService.setNotice(message, 'info');
      });
    }
  }
}
