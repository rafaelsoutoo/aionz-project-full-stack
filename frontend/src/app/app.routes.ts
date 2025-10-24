import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/products/products.component').then(m => m.ProductsComponent),
    title: 'Produtos'
  },
  {
    path: 'produto/:id',
    loadComponent: () => 
      import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Detalhes do Produto'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];