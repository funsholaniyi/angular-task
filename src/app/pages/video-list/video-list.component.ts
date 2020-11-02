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


    this.authorService.getAuthors().pipe(
      tap((authors) => {
        if (authors) {
          // go through the list of all authors to extract their videos, identify them and eventually merge them to a list
          this.videoList = authors.map(author => {
            // add authorName to each video item, to be able to identify the author name
            return author.videos.map(v => ({...v, authorName: author.name}));
          }).reduce(
            // this step is to combine the different chunks of arrays into one big array of videos
            (videoArray, videos) => videoArray.concat(videos));
        }
        this.filteredList = Array.from(this.videoList);
      }),
      catchError(error => {
        const message = 'An error occurred trying to get videos';
        this.guestNoticeService.setNotice(message, 'danger');
        return of(error);
      })).subscribe();
  }

  /**
   * Get category name by id and return joined string
   * @param catIds
   */
  getCategoryName(catIds: number[]) {
    // with each id, find its object in the category list, extract the name, then join into string
    return catIds.map(id =>
      this.categoryList.find(category =>
        category.id === id).name)
      .join(', ');
  }

  /**
   * function to return the highest video quality
   * @param formats
   */
  getHighestQuality(formats: FormatModel) {
    let highest = 0;
    let highestSize = 0;
    let highestKey = '';
    Object.keys(formats).forEach((key, i) => {
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

  /**
   * function to search by name or author name
   * @param event
   */
  searchList(event: any) {
    const search = event.target.value.toLowerCase();
    const copiedList = Array.from(this.videoList);

    if (search.length < 2) {
      this.filteredList = copiedList;
    }

    this.filteredList = copiedList.filter(video => {
      return (video.name.toLowerCase().includes(search) || video.authorName.toLowerCase().includes(search));
    });

  }

  /**
   * function to sort by specified column name
   * @param columnName
   */
  sortColumn(columnName: string) {
    this.filteredList.sort((a, b) => {
      return this.sortAsc ? a[columnName].localeCompare(b[columnName]) : b[columnName].localeCompare(a[columnName]);
    });
    this.sortAsc = !this.sortAsc;

  }
}
