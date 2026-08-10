import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductTimeline } from '../../components/ProductTimeline';
import type { Task } from '../../schemas/task';
import type { Product } from '../../schemas/product';

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  description: 'A test product',
  category: 'electronics',
  image: 'https://example.com/image.jpg',
  rating: { rate: 4.5, count: 100 },
};

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    status: 'completed',
    productId: 1,
    createdAt: '2026-08-06T00:00:00.000Z',
    updatedAt: '2026-08-06T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Task 2',
    status: 'pending',
    productId: 1,
    createdAt: '2026-08-06T00:00:00.000Z',
    updatedAt: '2026-08-06T00:00:00.000Z',
  },
];

const productsWithTasks = [
  { product: mockProduct, tasks: mockTasks },
];

describe('ProductTimeline', () => {
  it('should render nothing when empty', () => {
    const { container } = render(
      <ProductTimeline
        productsWithTasks={[]}
        onToggleExpand={jest.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render timeline header', () => {
    render(
      <ProductTimeline
        productsWithTasks={productsWithTasks}
        onToggleExpand={jest.fn()}
      />
    );
    expect(screen.getByText('Preparation Timeline')).toBeInTheDocument();
  });

  it('should render item count', () => {
    render(
      <ProductTimeline
        productsWithTasks={productsWithTasks}
        onToggleExpand={jest.fn()}
      />
    );
    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('should render product title', () => {
    render(
      <ProductTimeline
        productsWithTasks={productsWithTasks}
        onToggleExpand={jest.fn()}
      />
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('should render task count', () => {
    render(
      <ProductTimeline
        productsWithTasks={productsWithTasks}
        onToggleExpand={jest.fn()}
      />
    );
    expect(screen.getByText('1/2')).toBeInTheDocument();
  });

  it('should call onToggleExpand when clicked', async () => {
    const user = userEvent.setup();
    const onToggleExpand = jest.fn();
    render(
      <ProductTimeline
        productsWithTasks={productsWithTasks}
        onToggleExpand={onToggleExpand}
      />
    );
    await user.click(screen.getByText('Test Product'));
    expect(onToggleExpand).toHaveBeenCalledWith(1);
  });

  it('should show expanded details when product is expanded', () => {
    render(
      <ProductTimeline
        productsWithTasks={productsWithTasks}
        expandedProductId={1}
        onToggleExpand={jest.fn()}
      />
    );
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });
});
