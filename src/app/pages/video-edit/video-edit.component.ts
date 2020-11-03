import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthorModel } from '../../core/author/_models/author.model';
import { VideoModel } from '../../core/author/_models/video.model';
import { AuthorService } from '../../core/author/_services/author.service';
import { CategoryModel } from '../../core/category/_models/category.model';
import { CategoryService } from '../../core/category/_services/category.service';
import { GuestNoticeService } from '../../core/guest-notice/guest-notice.service';

@Component({
  selector: 'app-video-edit',
  templateUrl: './video-edit.component.html',
  styleUrls: ['./video-edit.component.scss']
})
export class VideoEditComponent implements OnInit, AfterViewInit {
  categoryList: CategoryModel[];
  highestVideoId = 0;
  videoForm: FormGroup;

  videoId: number;
  currentVideo: VideoModel;

  constructor(private authorService: AuthorService,
              private categoryService: CategoryService,
              private guestNoticeService: GuestNoticeService,
              private fb: FormBuilder,
              private route: ActivatedRoute
  ) {
    this.videoForm = this.fb.group({
      videoName: ['', Validators.required],
      videoAuthor: ['', Validators.required],
      categories: [[], Validators.required]
    });

    this.route.paramMap.pipe(tap((data: any) => {
      if (data) {
        this.videoId = data.get('id');
      }
    })).subscribe();
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
  }

  ngAfterViewInit(): void {
    this.authorService.getAuthors().pipe(
      tap((authors) => {
        if (authors.length) {
          const videosList = this.authorService.convertAuthorModelToVideoModel(authors);
          this.highestVideoId = videosList.reduce((prev, current) => (+prev.id > +current.id) ? prev : current).id;

          if (this.videoId) {
            // tslint:disable-next-line:triple-equals
            const currentVideo = videosList.find(d => d.id == this.videoId);
            if (currentVideo) {
              // update form with existing values
              this.videoForm.patchValue({
                videoName: currentVideo.name,
                videoAuthor: currentVideo.authorName,
                categories: currentVideo.catIds
              });

              this.currentVideo = currentVideo;
            }
          }
        }
      }),
      catchError(error => {
        const message = 'An error occurred trying to get videos';
        this.guestNoticeService.setNotice(message, 'danger');
        return of(error);
      })).subscribe();
  }

  onSubmit(): void {
    if (this.videoForm.invalid) {
      const message = 'Form not duly completed';
      this.guestNoticeService.setNotice(message, 'danger');
      return;
    }

    const author: AuthorModel = {
      name: this.videoForm.controls.videoAuthor.value,
      videos: [{
        // did this because id is not assigned automatically
        id: this.videoId ? this.videoId : ++this.highestVideoId,
        name: this.videoForm.controls.videoName.value,
        catIds: this.videoForm.controls.categories.value,
        formats: {one: {res: '1080p', size: 1000}},
        releaseDate: (new Date()).toLocaleDateString('en-CA')
      }]
    };

    if (this.currentVideo) {
      // perform an update
      this.authorService.updateAuthor(this.currentVideo.authorId, author).pipe(
        catchError(error => {
          const message = 'An error occurred trying to update video';
          this.guestNoticeService.setNotice(message, 'danger');
          return of(error);
        })).subscribe(data => {
        if (data) {
          const message = 'Video successfully updated';
          this.guestNoticeService.setNotice(message, 'success');
        }
      });
    } else {
      this.authorService.createAuthor(author).pipe(tap(response => {
          if (response) {
            const message = 'Video successfully added';
            this.guestNoticeService.setNotice(message, 'success');
          }
        }),
        catchError(error => {
          const message = 'An error occurred trying to add video';
          this.guestNoticeService.setNotice(message, 'danger');
          return of(error);
        })).subscribe();
    }

  }

}
