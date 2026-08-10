import app from './app';

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Products API running on http://localhost:${PORT}`);
  console.log(`  GET /products          - List all products`);
  console.log(`  GET /products/:id      - Get product by ID`);
  console.log(`  GET /products/categories - List categories`);
  console.log(`  GET /health            - Health check`);
});
