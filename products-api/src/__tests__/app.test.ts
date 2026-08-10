import request from 'supertest';
import app from '../app';
import { products } from '../data/products';

describe('Products API Routes', () => {
  describe('GET /products', () => {
    it('should return all products', async () => {
      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(20);
    });

    it('should return products with valid schema', async () => {
      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      res.body.forEach((product: Record<string, unknown>) => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('image');
        expect(product).toHaveProperty('rating');
      });
    });

    it('should filter products by category', async () => {
      const res = await request(app).get('/products?category=electronics');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((product: Record<string, unknown>) => {
        expect(product.category).toBe('electronics');
      });
    });

    it('should filter by women\'s clothing', async () => {
      const res = await request(app).get("/products?category=women's clothing");
      expect(res.status).toBe(200);
      res.body.forEach((product: Record<string, unknown>) => {
        expect(product.category).toBe("women's clothing");
      });
    });

    it('should return empty array for non-existent category', async () => {
      const res = await request(app).get('/products?category=nonexistent');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should limit results', async () => {
      const res = await request(app).get('/products?limit=3');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
    });

    it('should limit to 1 product', async () => {
      const res = await request(app).get('/products?limit=1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should handle limit larger than total products', async () => {
      const res = await request(app).get('/products?limit=100');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(20);
    });

    it('should combine category filter and limit', async () => {
      const res = await request(app).get('/products?category=electronics&limit=2');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      res.body.forEach((product: Record<string, unknown>) => {
        expect(product.category).toBe('electronics');
      });
    });
  });

  describe('GET /products/:id', () => {
    it('should return a product by ID', async () => {
      const res = await request(app).get('/products/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('price');
    });

    it('should return product with all required fields', async () => {
      const res = await request(app).get('/products/5');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 5);
      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('price');
      expect(res.body).toHaveProperty('description');
      expect(res.body).toHaveProperty('category');
      expect(res.body).toHaveProperty('image');
      expect(res.body).toHaveProperty('rating');
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/products/999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Product not found');
    });

    it('should return 404 for invalid ID format', async () => {
      const res = await request(app).get('/products/abc');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Product not found');
    });

    it('should return the correct product for each ID', async () => {
      for (const id of [1, 5, 10, 15, 20]) {
        const res = await request(app).get(`/products/${id}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
      }
    });
  });

  describe('GET /products/categories', () => {
    it('should return a list of categories', async () => {
      const res = await request(app).get('/products/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return unique categories', async () => {
      const res = await request(app).get('/products/categories');
      expect(res.status).toBe(200);
      const unique = new Set(res.body);
      expect(unique.size).toBe(res.body.length);
    });

    it('should contain expected categories', async () => {
      const res = await request(app).get('/products/categories');
      expect(res.body).toContain("men's clothing");
      expect(res.body).toContain("women's clothing");
      expect(res.body).toContain('jewelery');
      expect(res.body).toContain('electronics');
    });

    it('should return exactly 4 categories', async () => {
      const res = await request(app).get('/products/categories');
      expect(res.body).toHaveLength(4);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('service', 'products-api');
      expect(res.body).toHaveProperty('products', 20);
    });
  });

  describe('CORS headers', () => {
    it('should include Access-Control-Allow-Origin header', async () => {
      const res = await request(app).get('/products');
      expect(res.headers['access-control-allow-origin']).toBe('*');
    });
  });
});
