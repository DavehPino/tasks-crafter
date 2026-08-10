import type { Product } from '../schemas/product';

const PRODUCTS_API_URL = import.meta.env.VITE_PRODUCTS_API_URL

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error?.message ?? 'Request failed');
  }
  return res.json();
};

export const fetchProducts = async (category?: string): Promise<Product[]> => {
  const url = category
    ? `${PRODUCTS_API_URL}/products?category=${category}`
    : `${PRODUCTS_API_URL}/products`;
  return request<Product[]>(url);
};

export const fetchProduct = async (id: number): Promise<Product> => {
  return request<Product>(`${PRODUCTS_API_URL}/products/${id}`);
};
