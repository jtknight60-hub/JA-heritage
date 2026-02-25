import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css'],
})
export class Shop {
  products: any[] = [];

  constructor(
    private cart: CartService,
    private productService: ProductService,
  ) {
    this.load();
  }

  load() {
    this.productService.getProducts().subscribe({
      next: (res) => (this.products = res || []),
      error: () => {
        // fallback to a small local set if backend is unreachable
        this.products = [
          {
            id: 'rum',
            title: 'Jamaican Rum',
            price: 29.99,
            image: 'https://via.placeholder.com/400x300?text=Jamaican+Rum',
          },
          {
            id: 'coffee',
            title: 'Blue Mountain Coffee (250g)',
            price: 19.5,
            image: 'https://via.placeholder.com/400x300?text=Blue+Mountain+Coffee',
          },
          {
            id: 'jerk-sauce',
            title: 'Authentic Jerk Sauce',
            price: 8.75,
            image: 'https://via.placeholder.com/400x300?text=Jerk+Sauce',
          },
        ];
      },
    });
  }

  add(p: any) {
    this.cart.addItem({ id: p.id, title: p.title, price: p.price }, 1);
  }

  removeOne(p: any) {
    const items = this.cart.items();
    const found = items.find((i) => i.id === p.id);
    if (found) this.cart.setQuantity(p.id, found.quantity - 1);
  }
}
