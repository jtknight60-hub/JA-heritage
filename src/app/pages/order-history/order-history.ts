import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css'],
})
export class OrderHistory {
  orders = signal<any[]>([]);
  session = signal<any | null>(null);

  constructor(private router: Router) {
    // initialize session
    try {
      const raw = localStorage.getItem('ja_session');
      if (raw) this.session.set(JSON.parse(raw));
    } catch {}

    // load orders for current session
    this.loadOrders();

    // update when storage changes (other tabs or actions)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'ja_orders' || e.key === 'ja_session') this.loadOrders();
      });
    }
  }

  loadOrders() {
    try {
      const raw = localStorage.getItem('ja_orders') || '[]';
      const all = JSON.parse(raw) as any[];
      const s = this.session();
      if (s && s.email) {
        this.orders.set(all.filter((o) => o.user && o.user.email === s.email));
      } else {
        this.orders.set([]);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
      this.orders.set([]);
    }
  }

  viewOrder(o: any) {
    this.router.navigate(['/order', o.id]);
  }
}
