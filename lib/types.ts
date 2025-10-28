export interface Category {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  quantity: number
  price: number
  category_id?: string
  description?: string
  sku?: string
  created_at: string
  updated_at: string
}

export interface ProductWithCategory extends Product {
  categories?: Category
}

export interface CreateProductData {
  name: string
  quantity: number
  price: number
  category_id?: string
  description?: string
  sku?: string
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string
}

export interface CreateCategoryData {
  name: string
  description?: string
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}

export type ApiResponse<T> = {
  data: T | null
  error: string | null
  loading: boolean
}