import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/products';
import { ProductCard } from '../components/ProductCard';

const CATEGORIES = ['all', "men's clothing", "women's clothing", 'jewelery', 'electronics'];

export const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => fetchProducts(selectedCategory === 'all' ? undefined : selectedCategory),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <span className="text-sm text-gray-500">
          {products?.length ?? 0} products
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="text-center py-12 text-gray-500">Loading products...</div>
      )}

      {isError && (
        <div className="text-center py-12 text-red-500">
          Error loading products. Make sure the mock API is running.
          <br />
          <code className="text-sm mt-2 block">docker-compose up -d</code>
        </div>
      )}

      {products && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
