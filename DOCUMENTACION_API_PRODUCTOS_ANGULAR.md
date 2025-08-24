# API Productos - Integración Angular

**Base URL:** `http://localhost:3000`  
**Swagger:** `http://localhost:3000/api`  
**Auth:** JWT Bearer Token

## Endpoints

### 1. GET `/products`
**Query Params:** `sellerUserId`, `page`, `limit`
```json
{
  "data": [{
    "id": 1,
    "seller_user_id": "user123",
    "name": "Producto",
    "description": "Desc",
    "price_amount": 99.99,
    "currency_tab": "USD",
    "currency_cod": "$",
    "stock": 50,
    "discount_percent": 10,
    "enabled": true,
    "url_img": "https://ejemplo.com/img.jpg"
  }],
  "total": 100, "page": 1, "limit": 10
}
```

### 2. GET `/products/{id}`
```json
{
  "id": 1,
  "sellerUserId": "user123",
  "name": "Producto",
  "description": "Desc",
  "priceAmount": 99.99,
  "currencyTab": "USD",
  "currencyCod": "$",
  "stock": 50,
  "discountPercent": 10,
  "enabled": true,
  "urlImg": "https://ejemplo.com/img.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. POST `/products`
```json
{
  "sellerUserId": "user123",
  "name": "Producto",
  "description": "Desc",
  "priceAmount": 149.99,
  "currencyTab": "USD",
  "currencyCod": "$",
  "stock": 25,
  "discountPercent": 5,
  "urlImg": "https://ejemplo.com/img.jpg"
}
```

### 4. PATCH `/products/{id}`
```json
{
  "name": "Producto Actualizado",
  "priceAmount": 199.99,
  "urlImg": "https://ejemplo.com/nueva-img.jpg"
}
```

### Otros Endpoints
- GET `/products/seller/{sellerId}` - Productos por vendedor
- PATCH `/products/{id}/disable` - Desactivar
- PATCH `/products/{id}/enable` - Activar  
- DELETE `/products/{id}` - Soft delete

## Interfaces TypeScript

```typescript
export interface ProductListResponse {
  data: ProductListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductListItem {
  id: number;
  seller_user_id: string;
  name: string;
  description: string;
  price_amount: number;
  currency_tab: string;
  currency_cod: string;
  stock: number;
  discount_percent: number;
  enabled: boolean;
  url_img: string | null;
}

export interface ProductDetail {
  id: number;
  sellerUserId: string;
  name: string;
  description: string;
  priceAmount: number;
  currencyTab: string;
  currencyCod: string;
  stock: number;
  discountPercent: number;
  enabled: boolean;
  urlImg: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  sellerUserId: string;
  name: string;
  description: string;
  priceAmount: number;
  currencyTab: string;
  currencyCod: string;
  stock: number;
  discountPercent?: number;
  urlImg?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  priceAmount?: number;
  currencyTab?: string;
  currencyCod?: string;
  stock?: number;
  discountPercent?: number;
  urlImg?: string;
}
```

## Servicio Angular

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(filters?: {
    sellerUserId?: string;
    page?: number;
    limit?: number;
  }): Observable<ProductListResponse> {
    let params = new HttpParams();
    if (filters?.sellerUserId) params = params.set('sellerUserId', filters.sellerUserId);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());
    return this.http.get<ProductListResponse>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: CreateProductDto): Observable<ProductDetail> {
    return this.http.post<ProductDetail>(this.apiUrl, product);
  }

  updateProduct(id: number, updates: UpdateProductDto): Observable<ProductDetail> {
    return this.http.patch<ProductDetail>(`${this.apiUrl}/${id}`, updates);
  }

  getProductsBySeller(sellerId: string): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(`${this.apiUrl}/seller/${sellerId}`);
  }

  disableProduct(id: number): Observable<ProductDetail> {
    return this.http.patch<ProductDetail>(`${this.apiUrl}/${id}/disable`, {});
  }

  enableProduct(id: number): Observable<ProductDetail> {
    return this.http.patch<ProductDetail>(`${this.apiUrl}/${id}/enable`, {});
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

## Notas
- **url_img:** Campo nuevo nullable para URLs de imágenes
- **Auth:** Header `Authorization: Bearer <token>`
- **Soft Delete:** DELETE no elimina físicamente
- **Paginación:** Usar `page` y `limit`
- **Filtros:** `sellerUserId` para filtrar por vendedor