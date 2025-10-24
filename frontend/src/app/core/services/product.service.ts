import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { Product } from '../models/product.model';
import { CreateProductDto } from '../../shared/dto/create-product.dto';
import { environment } from '../../../environments/environment';

interface ProductListResponse {
  produtos: Array<{
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    imagem: string;
    createdat: string;
  }>;
  hasNextPage: boolean;
}


export interface PaginatedProducts {
  products: Product[];
  hasNextPage: boolean;
}
interface ProductResponse {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = `${environment.apiUrl}/produtos`;

  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();
  public hasNextPage: boolean = true;


  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.getProducts().subscribe({
      next: ({ products, hasNextPage }) => {
        this.productsSubject.next(products);
      
      },
      error: (err) => console.error('Erro ao carregar produtos:', err)
    });
  }


  loadMore(page: number, limit: number = 10, query?: string): void {
    this.getProducts(page, limit, query).subscribe({
      next: ({ products, hasNextPage }) => {
        const current = this.productsSubject.value;
        this.productsSubject.next([...current, ...products]);
        this.hasNextPage = hasNextPage;
      },
    });
  }


  getProducts(page: number = 1, limit: number = 10, query?: string): Observable<PaginatedProducts> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (query) {
      params = params.set('query', query);
    }

    return this.http.get<ProductListResponse>(this.API_URL, { params }).pipe(
      map(response => ({
        products: response.produtos.map(p => ({
          id: p.id,
          nome: p.nome,
          descricao: p.descricao,
          preco: p.preco,
          categoria: p.categoria,
          imagem: p.imagem,
          createdAt: new Date(p.createdat),
        })),
        hasNextPage: response.hasNextPage,
      }))
    );
  }




  getProductById(id: string): Observable<Product | undefined> {
    return this.http.get<ProductResponse>(`${this.API_URL}/${id}`).pipe(
      map(response => ({
        id: response.id,
        nome: response.nome,
        descricao: response.descricao,
        preco: response.preco,
        categoria: response.categoria,
        imagem: response.imagem,
        createdAt: new Date(response.createdAt)
      }))
    );
  }

  createProduct(dto: CreateProductDto): Observable<Product> {
    const formData = new FormData();
    formData.append('nome', dto.nome);
    formData.append('descricao', dto.descricao);
    formData.append('preco', dto.preco.toString());
    formData.append('categoria', dto.categoria);
    formData.append('imagem', dto.imagem);

    return this.http.post<ProductResponse>(this.API_URL, formData).pipe(
      map(response => ({
        id: response.id,
        nome: response.nome,
        descricao: response.descricao,
        preco: response.preco,
        categoria: response.categoria,
        imagem: response.imagem,
        createdAt: new Date(response.createdAt)
      })),
      tap(newProduct => {
        const currentProducts = this.productsSubject.value;
        this.productsSubject.next([newProduct, ...currentProducts]);
      })
    );
  }


  updateProduct(id: string, dto: Partial<CreateProductDto>): Observable<Product> {
    return this.http.put<ProductResponse>(`${this.API_URL}/${id}`, dto).pipe(
      map(response => ({
        id: response.id,
        nome: response.nome,
        descricao: response.descricao,
        preco: response.preco,
        categoria: response.categoria,
        imagem: response.imagem,
        createdAt: new Date(response.createdAt)
      })),
      tap(updatedProduct => {
        const products = this.productsSubject.value;
        const index = products.findIndex(p => p.id === id);

        if (index !== -1) {
          products[index] = updatedProduct;
          this.productsSubject.next([...products]);
        }
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        const products = this.productsSubject.value.filter(p => p.id !== id);
        this.productsSubject.next(products);
      })
    );
  }
}