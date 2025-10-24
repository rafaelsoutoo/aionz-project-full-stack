import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    const stateProduct = history.state.product as Product | undefined;
    const productId = this.route.snapshot.paramMap.get('id');

    if (stateProduct) {
      this.product = stateProduct;
      this.isLoading = false;
      this.setSEOTags(stateProduct);
    } else if (productId) {
      this.loadProduct(productId);
    } else {
      this.notFound = true;
      this.isLoading = false;
    }
  }

  loadProduct(id: string): void {
    this.isLoading = true;

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          this.setSEOTags(product);
        } else {
          this.notFound = true;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produto:', error);
        this.notFound = true;
        this.isLoading = false;
      }
    });
  }

  private setSEOTags(product: Product): void {
    this.titleService.setTitle(`${product.nome}`);
    
    this.metaService.updateTag({ name: 'description', content: product.descricao });
    this.metaService.updateTag({ property: 'og:title', content: product.nome });
    this.metaService.updateTag({ property: 'og:description', content: product.descricao });
    this.metaService.updateTag({ property: 'og:image', content: product.imagem });
    this.metaService.updateTag({ property: 'og:type', content: 'product' });
    this.metaService.updateTag({ property: 'product:price:amount', content: product.preco.toString() });
    this.metaService.updateTag({ property: 'product:price:currency', content: 'BRL' });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}

