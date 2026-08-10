import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductSelector } from '../../components/ProductSelector';
import type { Product } from '../../schemas/product';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Product 1',
    price: 99.99,
    description: 'Product 1 desc',
    category: 'electronics',
    image: 'https://example.com/1.jpg',
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: 2,
    title: 'Product 2',
    price: 149.99,
    description: 'Product 2 desc',
    category: 'clothing',
    image: 'https://example.com/2.jpg',
    rating: { rate: 4.0, count: 50 },
  },
];

describe('ProductSelector', () => {
  const defaultProps = {
    products: mockProducts,
    isLoading: false,
    isError: false,
    onSelectionChange: jest.fn(),
    onGenerateTasks: jest.fn(),
    isGeneratingTasks: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render header with product count', () => {
    render(<ProductSelector {...defaultProps} />);
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('0/2')).toBeInTheDocument();
  });

  it('should render loading state when loading', () => {
    const { container } = render(<ProductSelector {...defaultProps} isLoading={true} />);
    // When loading, the skeleton grid should be present but products should not
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should render error message when error', () => {
    render(<ProductSelector {...defaultProps} isError={true} />);
    expect(screen.getByText(/Error loading products/)).toBeInTheDocument();
  });

  it('should render products', () => {
    render(<ProductSelector {...defaultProps} />);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('should call onSelectionChange when product is selected', async () => {
    const user = userEvent.setup();
    const onSelectionChange = jest.fn();
    render(
      <ProductSelector {...defaultProps} onSelectionChange={onSelectionChange} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // First product checkbox
    expect(onSelectionChange).toHaveBeenCalledWith([1]);
  });

  it('should show generate button when products are selected', async () => {
    const user = userEvent.setup();
    render(<ProductSelector {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);
    expect(screen.getByText(/Generate Prep Tasks/)).toBeInTheDocument();
  });

  it('should call onGenerateTasks when generate button is clicked', async () => {
    const user = userEvent.setup();
    const onGenerateTasks = jest.fn();
    render(
      <ProductSelector {...defaultProps} onGenerateTasks={onGenerateTasks} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);
    await user.click(screen.getByText(/Generate Prep Tasks/));
    expect(onGenerateTasks).toHaveBeenCalled();
  });

  it('should select all products when select all is clicked', async () => {
    const user = userEvent.setup();
    const onSelectionChange = jest.fn();
    render(
      <ProductSelector {...defaultProps} onSelectionChange={onSelectionChange} />
    );
    const selectAllCheckbox = screen.getByText('All').previousSibling;
    await user.click(selectAllCheckbox!);
    expect(onSelectionChange).toHaveBeenCalledWith([1, 2]);
  });
});
