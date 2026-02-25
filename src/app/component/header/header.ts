import { Component, signal, effect, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'About', path: '/about' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  // UI state
  menuOpen = signal(false);
  badgePulse = signal(false);
  headerShrunk = signal(false);
  session = signal<any | null>(null);

  constructor(
    public cart: CartService,
    private router: Router,
  ) {
    // pulse the badge briefly whenever cart count increases
    effect(() => {
      const count = this.cart.cartCount();
      if (count > 0) {
        this.badgePulse.set(true);
        setTimeout(() => this.badgePulse.set(false), 380);
      }
    });

    // load session from localStorage (only in browser)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem('ja_session');
        if (raw) this.session.set(JSON.parse(raw));
      } catch {}

      // update session if storage changes in other tabs
      window.addEventListener('storage', (e) => {
        if (e.key === 'ja_session') {
          try {
            this.session.set(e.newValue ? JSON.parse(e.newValue) : null);
          } catch {
            this.session.set(null);
          }
        }
      });
    }

    // refresh session on navigation (in same tab after login/logout) - only in browser
    if (typeof window !== 'undefined') {
      this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
        try {
          const raw = localStorage.getItem('ja_session');
          this.session.set(raw ? JSON.parse(raw) : null);
        } catch {
          this.session.set(null);
        }
      });
    }
  }

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof window === 'undefined') return;
    this.headerShrunk.set(window.scrollY > 48);
  }

  logout() {
    localStorage.removeItem('ja_session');
    this.session.set(null);
    this.router.navigate(['/']);
  }

  title() {
    return 'JA Heritage';
  }
}
