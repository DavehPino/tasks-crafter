import express from 'express';
import cors from 'cors';
import { productSchema } from './schemas/product';
import { products } from './data/products';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/products', (req, res) => {
  const { category, limit } = req.query;
  let result = [...products];

  if (category) {
    result = result.filter((p) => p.category === category);
  }

  if (limit) {
    result = result.slice(0, parseInt(limit as string, 10));
  }

  const validated = result.map((p) => productSchema.parse(p));
  res.json(validated);
});

app.get('/products/categories', (_req, res) => {
  const categories = [...new Set(products.map((p) => p.category))];
  res.json(categories);
});

app.get('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id, 10));
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const validated = productSchema.parse(product);
  res.json(validated);
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'products-api', products: products.length });
});

export default app;
