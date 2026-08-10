import { productSchema, productRatingSchema } from '../../schemas/product';

describe('Product Schemas', () => {
  describe('productRatingSchema', () => {
    it('should validate a valid rating', () => {
      const result = productRatingSchema.safeParse({ rate: 4.5, count: 100 });
      expect(result.success).toBe(true);
    });

    it('should reject rating with non-number rate', () => {
      const result = productRatingSchema.safeParse({ rate: 'high', count: 100 });
      expect(result.success).toBe(false);
    });

    it('should reject rating with non-number count', () => {
      const result = productRatingSchema.safeParse({ rate: 4.5, count: 'many' });
      expect(result.success).toBe(false);
    });

    it('should reject rating with missing fields', () => {
      const result = productRatingSchema.safeParse({ rate: 4.5 });
      expect(result.success).toBe(false);
    });
  });

  describe('productSchema', () => {
    const validProduct = {
      id: 1,
      title: 'Test Product',
      price: 29.99,
      description: 'A test product',
      category: 'electronics',
      image: 'https://example.com/img.png',
      rating: { rate: 4.0, count: 50 },
    };

    it('should validate a complete product object', () => {
      const result = productSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should reject product with missing id', () => {
      const { id, ...noId } = validProduct;
      const result = productSchema.safeParse(noId);
      expect(result.success).toBe(false);
    });

    it('should reject product with non-number id', () => {
      const result = productSchema.safeParse({ ...validProduct, id: '1' });
      expect(result.success).toBe(false);
    });

    it('should reject product with missing title', () => {
      const { title, ...noTitle } = validProduct;
      const result = productSchema.safeParse(noTitle);
      expect(result.success).toBe(false);
    });

    it('should reject product with non-string title', () => {
      const result = productSchema.safeParse({ ...validProduct, title: 123 });
      expect(result.success).toBe(false);
    });

    it('should reject product with missing price', () => {
      const { price, ...noPrice } = validProduct;
      const result = productSchema.safeParse(noPrice);
      expect(result.success).toBe(false);
    });

    it('should reject product with non-number price', () => {
      const result = productSchema.safeParse({ ...validProduct, price: 'expensive' });
      expect(result.success).toBe(false);
    });

    it('should reject product with missing description', () => {
      const { description, ...noDesc } = validProduct;
      const result = productSchema.safeParse(noDesc);
      expect(result.success).toBe(false);
    });

    it('should reject product with missing category', () => {
      const { category, ...noCat } = validProduct;
      const result = productSchema.safeParse(noCat);
      expect(result.success).toBe(false);
    });

    it('should reject product with missing image', () => {
      const { image, ...noImg } = validProduct;
      const result = productSchema.safeParse(noImg);
      expect(result.success).toBe(false);
    });

    it('should reject product with missing rating', () => {
      const { rating, ...noRating } = validProduct;
      const result = productSchema.safeParse(noRating);
      expect(result.success).toBe(false);
    });

    it('should reject product with invalid rating shape', () => {
      const result = productSchema.safeParse({ ...validProduct, rating: { rate: 'high' } });
      expect(result.success).toBe(false);
    });

    it('should accept product with zero price', () => {
      const result = productSchema.safeParse({ ...validProduct, price: 0 });
      expect(result.success).toBe(true);
    });

    it('should accept product with large price', () => {
      const result = productSchema.safeParse({ ...validProduct, price: 99999.99 });
      expect(result.success).toBe(true);
    });
  });
});
