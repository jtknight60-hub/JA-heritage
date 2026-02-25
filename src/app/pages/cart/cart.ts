import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../core/services/cart.service';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart {
  constructor(
    public cart: CartService,
    private router: Router,
    private orderService: OrderService,
  ) {}

  increase(item: CartItem) {
    this.cart.addItem({ id: item.id, title: item.title, price: item.price }, 1);
  }

  decrease(item: CartItem) {
    this.cart.setQuantity(item.id, item.quantity - 1);
  }

  remove(item: CartItem) {
    this.cart.removeItem(item.id);
  }

  checkout() {
    const total = this.cart.total();
    const items = this.cart.items();
    // get session
    let session = null;
    try {
      session = JSON.parse(localStorage.getItem('ja_session') || 'null');
    } catch {}

    const order = {
      // backend should assign final id, but include a client-side temp id
      clientId: 'ord_' + Date.now(),
      date: new Date().toISOString(),
      items: items,
      total: total,
      user: session ? { email: session.email, name: session.name } : null,
    };

    const token = localStorage.getItem('token') || undefined;

    this.orderService.createOrder(order, token || undefined).subscribe({
      next: (res: any) => {
        alert('Order placed. Total: $' + total.toFixed(2));
        this.cart.clear();
        // navigate to order history
        this.router.navigate(['/order-history']);
      },
      error: (err) => {
        console.error('Failed to create order on backend, falling back to local save', err);
        // fallback to localStorage so users still have orders
        try {
          const raw = localStorage.getItem('ja_orders') || '[]';
          const orders = JSON.parse(raw);
          orders.push(order);
          localStorage.setItem('ja_orders', JSON.stringify(orders));
        } catch (e) {}
        alert('Order placed locally (offline). Total: $' + total.toFixed(2));
        this.cart.clear();
        this.router.navigate(['/order-history']);
      },
    });
  }
}
