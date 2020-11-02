import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CategoryModel } from '../_models/category.model';

const API_ENDPOINT = environment.backendEndpoint;

@Injectable({providedIn: 'root'})
export class CategoryService {
  constructor(private http: HttpClient) {
  }


  getCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(API_ENDPOINT + 'categories');
  }

}
