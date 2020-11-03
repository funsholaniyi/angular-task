import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthorModel } from '../_models/author.model';
import { VideoModel } from '../_models/video.model';

const API_ENDPOINT = environment.backendEndpoint;

@Injectable({providedIn: 'root'})
export class AuthorService {
  constructor(private http: HttpClient) {
  }

  getAuthors(): Observable<AuthorModel[]> {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.get<AuthorModel[]>(API_ENDPOINT + 'authors', {headers: httpHeaders});
  }

  createAuthor(author: AuthorModel): Observable<AuthorModel> {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');

    return this.http.post<AuthorModel>(API_ENDPOINT + 'authors', author, {headers: httpHeaders});
  }

  updateAuthor(authorId, author: AuthorModel): Observable<AuthorModel> {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.put<AuthorModel>(API_ENDPOINT + 'authors/' + authorId, author, {headers: httpHeaders});
  }

  deleteAuthor(authorId: number): any {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.delete<any>(API_ENDPOINT + 'authors/' + authorId, {headers: httpHeaders});
  }

  convertAuthorModelToVideoModel(authors: AuthorModel[]): VideoModel[] {
    // go through the list of all authors to extract their videos, identify them and eventually merge them to a list
    return authors.map(author => {
      if (!author.videos.length) {
        return [];
      }
      // add authorName and author id to each video item, to be able to identify the author of the video
      return author.videos.map(v => ({...v, authorName: author.name, authorId: author.id}));
    }).reduce(
      // this step is to combine the different chunks of arrays into one big array of videos
      (videoArray, videos) => videoArray.concat(videos));
  }

}
