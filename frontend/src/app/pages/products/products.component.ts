import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { CreateProductDto } from '../../shared/dto/create-product.dto';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ModalComponent, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  currentPage = 1;
  limit = 9;
  hasNextPage = true;

  isLoading = false;
  isLoadingMore = false;
  isSubmitting = false;
  isModalOpen = false;

  productForm: FormGroup;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.productForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(3)]],
      preco: ['', [Validators.required, Validators.min(0.01)]],
      categoria: ['', [Validators.required]],
      imagem: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.setSEOTags();
    this.loadProducts();
  }

  private setSEOTags(): void {
    this.titleService.setTitle('Produtos');
    this.metaService.updateTag({
      name: 'description',
      content: 'Confira nossa seleção de produtos eletrônicos, áudio, wearables e muito mais com os melhores preços.'
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.currentPage, this.limit).subscribe({
      next: ({ products, hasNextPage }) => {
        this.products = products;
        this.hasNextPage = hasNextPage;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  loadMore(): void {
    if (!this.hasNextPage || this.isLoadingMore) return;

    this.isLoadingMore = true;
    this.currentPage++;

    this.productService.getProducts(this.currentPage, this.limit).subscribe({
      next: ({ products, hasNextPage }) => {
        this.products = [...this.products, ...products];
        this.hasNextPage = hasNextPage;
        this.isLoadingMore = false;
      },
      error: (error) => {
        this.isLoadingMore = false;
      }
    });
  }

  openModal(): void {
    this.isModalOpen = true;
    this.productForm.reset();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.productForm.reset();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isSubmitting = true;
  
      const dto: CreateProductDto = {
        nome: this.productForm.value.nome,
        descricao: this.productForm.value.descricao,
        preco: this.productForm.value.preco,
        categoria: this.productForm.value.categoria,
        imagem: this.productForm.value.imagem 
      };
  
      this.productService.createProduct(dto).subscribe({
        next: (product) => {
          this.products = [product, ...this.products];
          this.closeModal();
          this.isSubmitting = false;
        },
        error: () => {
          alert('Erro ao criar produto. Tente novamente.');
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.productForm);
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length) {
      const file = fileInput.files[0];
      this.productForm.patchValue({ imagem: file });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => formGroup.get(key)?.markAsTouched());
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.hasError('required')) return 'Este campo é obrigatório';
    if (field?.hasError('minlength')) return `Mínimo de ${field.errors?.['minlength'].requiredLength} caracteres`;
    if (field?.hasError('min')) return 'Valor deve ser maior que zero';
    return '';
  }
}
