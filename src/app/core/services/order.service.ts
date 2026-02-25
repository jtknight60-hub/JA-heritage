import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createOrder(order: any, token?: string) {
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.post(`${this.api}/orders`, order, { headers });
  }

  getOrders(email?: string, token?: string) {
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    const url = email ? `${this.api}/orders?email=${encodeURIComponent(email)}` : `${this.api}/orders`;
    return this.http.get<any[]>(url, { headers });
  }

  getOrderById(id: string, token?: string) {
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get<any>(`${this.api}/orders/${id}`, { headers });
  }
}
