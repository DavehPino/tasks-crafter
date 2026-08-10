import { products } from '../../data/products';
import { productSchema } from '../../schemas/product';

describe('Products Data', () => {
  it('should contain 20 products', () => {
    expect(products).toHaveLength(20);
  });

  it('should have all products pass schema validation', () => {
    products.forEach((product) => {
      const result = productSchema.safeParse(product);
      expect(result.success).toBe(true);
    });
  });

  it('should have unique IDs', () => {
    const ids = products.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(products.length);
  });

  it('should have sequential IDs starting from 1', () => {
    const ids = products.map((p) => p.id).sort((a, b) => a - b);
    expect(ids[0]).toBe(1);
    expect(ids[ids.length - 1]).toBe(20);
  });

  it('should have all required fields for every product', () => {
    products.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('image');
      expect(product).toHaveProperty('rating');
      expect(product.rating).toHaveProperty('rate');
      expect(product.rating).toHaveProperty('count');
    });
  });

  it('should have positive prices for all products', () => {
    products.forEach((product) => {
      expect(product.price).toBeGreaterThanOrEqual(0);
    });
  });

  it('should have non-empty titles', () => {
    products.forEach((product) => {
      expect(product.title.length).toBeGreaterThan(0);
    });
  });

  it('should have non-empty categories', () => {
    products.forEach((product) => {
      expect(product.category.length).toBeGreaterThan(0);
    });
  });

  it('should contain products from expected categories', () => {
    const categories = [...new Set(products.map((p) => p.category))];
    expect(categories).toContain("men's clothing");
    expect(categories).toContain("women's clothing");
    expect(categories).toContain('jewelery');
    expect(categories).toContain('electronics');
  });

  it('should have valid rating values', () => {
    products.forEach((product) => {
      expect(product.rating.rate).toBeGreaterThanOrEqual(0);
      expect(product.rating.rate).toBeLessThanOrEqual(5);
      expect(product.rating.count).toBeGreaterThan(0);
    });
  });
});
