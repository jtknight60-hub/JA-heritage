import { Injectable, signal, computed } from '@angular/core';

export interface Product {
  id: string;
  title: string;
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);

  readonly items = this._items;

  readonly cartCount = computed(() => this._items().reduce((s, i) => s + i.quantity, 0));

  readonly total = computed(() => this._items().reduce((s, i) => s + i.quantity * i.price, 0));

  addItem(p: Product, amount = 1) {
    const items = this._items();
    const idx = items.findIndex((i) => i.id === p.id);
    if (idx >= 0) {
      const copy = [...items];
      copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + amount };
      this._items.set(copy);
    } else {
      this._items.set([...items, { ...p, quantity: amount }]);
    }
  }

  removeItem(productId: string) {
    this._items.set(this._items().filter((i) => i.id !== productId));
  }

  setQuantity(productId: string, quantity: number) {
    const items = this._items();
    const idx = items.findIndex((i) => i.id === productId);
    if (idx >= 0) {
      const copy = [...items];
      if (quantity <= 0) {
        copy.splice(idx, 1);
      } else {
        copy[idx] = { ...copy[idx], quantity };
      }
      this._items.set(copy);
    }
  }

  clear() {
    this._items.set([]);
  }
}
