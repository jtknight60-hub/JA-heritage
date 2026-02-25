import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'shop', loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  {
    path: 'product',
    loadComponent: () =>
      import('./pages/product-details/product-details').then((m) => m.ProductDetails),
  },
  {
    path: 'order/:id',
    loadComponent: () => import('./pages/order-details/order-details').then((m) => m.OrderDetails),
  },
  {
    path: 'order-history',
    loadComponent: () => import('./pages/order-history/order-history').then((m) => m.OrderHistory),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
  },
  { path: 'login', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  { path: '**', redirectTo: '' },
];
