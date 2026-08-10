import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from '../../components/ProductCard';
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

describe('ProductCard', () => {
  it('should render product title', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('should render product price', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    expect(container.textContent).toContain('$100');
  });

  it('should render product rating', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('should render product category', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('electronics')).toBeInTheDocument();
  });

  it('should render product image', () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByAltText('Test Product');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should render select button when onSelect is provided', () => {
    const onSelect = jest.fn();
    render(<ProductCard product={mockProduct} onSelect={onSelect} />);
    expect(screen.getByText('Assign to Session')).toBeInTheDocument();
  });

  it('should not render select button when onSelect is not provided', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.queryByText('Assign to Session')).not.toBeInTheDocument();
  });

  it('should call onSelect when button is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(<ProductCard product={mockProduct} onSelect={onSelect} />);
    await user.click(screen.getByText('Assign to Session'));
    expect(onSelect).toHaveBeenCalledWith(mockProduct);
  });

  it('should apply index animation delay', () => {
    const { container } = render(<ProductCard product={mockProduct} index={2} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
