import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthorModel } from '../_models/author.model';

const API_ENDPOINT = environment.backendEndpoint;

@Injectable({providedIn: 'root'})
export class AuthorService {
  constructor(private http: HttpClient) {
  }


  getAuthors(): Observable<AuthorModel[]> {
    return this.http.get<AuthorModel[]>(API_ENDPOINT + 'authors');
  }

}
