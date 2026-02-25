import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.css'],
})
export class OrderDetails {
  order: any | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.load(id);
  }

  load(id: string) {
    // try backend first
    try {
      const token = localStorage.getItem('token') || undefined;
      fetch(`${(window as any)?.__env?.apiUrl || '/api'}/orders/${encodeURIComponent(id)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
        .then((r) => (r.ok ? r.json() : Promise.reject(r)))
        .then((data) => {
          this.order = data;
        })
        .catch(() => {
          // fallback to localStorage
          try {
            const raw = localStorage.getItem('ja_orders') || '[]';
            const all = JSON.parse(raw) as any[];
            this.order = all.find((o) => o.id === id) || null;
          } catch (err) {
            console.error('Failed to load order', err);
            this.order = null;
          }
        });
    } catch (err) {
      console.error('Failed to load order', err);
      this.order = null;
    }
  }

  back() {
    this.router.navigate(['/order-history']);
  }
}
