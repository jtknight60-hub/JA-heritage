import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<any[]>(`${this.api}/products`);
  }

  getProduct(id: string) {
    return this.http.get<any>(`${this.api}/products/${id}`);
  }
}
