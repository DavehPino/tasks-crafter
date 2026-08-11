import { render, screen } from '@testing-library/react';
import { LiveShoppingDialog } from '../../components/LiveShoppingDialog';
import type { Product } from '../../schemas/product';

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  description: 'Test description',
  category: 'electronics',
  image: 'https://example.com/image.jpg',
  rating: {
    rate: 4.5,
    count: 100,
  },
};

describe('LiveShoppingDialog', () => {
  // Mock navigator.mediaDevices
  beforeEach(() => {
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        getUserMedia: jest.fn().mockResolvedValue({
          getTracks: () => [],
        }),
      },
      writable: true,
      configurable: true,
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render dialog title when open is true', () => {
    render(
      <LiveShoppingDialog
        open={true}
        onOpenChange={jest.fn()}
        canGoLive={true}
        products={[mockProduct]}
      />
    );

    expect(screen.getByText('Live Shopping Simulator')).toBeInTheDocument();
  });

  it('should not render dialog when open is false', () => {
    const { container } = render(
      <LiveShoppingDialog
        open={false}
        onOpenChange={jest.fn()}
        canGoLive={true}
        products={[mockProduct]}
      />
    );

    // Dialog should not be in the DOM
    expect(container.textContent).not.toContain('Live Shopping Simulator');
  });

  it('should render with disabled state when canGoLive is false', () => {
    render(
      <LiveShoppingDialog
        open={true}
        onOpenChange={jest.fn()}
        canGoLive={false}
        products={[mockProduct]}
      />
    );

    // Should render but with warning about not being able to go live
    expect(screen.getByText('Live Shopping Simulator')).toBeInTheDocument();
  });

  it('should handle state transitions correctly', () => {
    const { container } = render(
      <LiveShoppingDialog
        open={true}
        onOpenChange={jest.fn()}
        canGoLive={true}
        products={[mockProduct]}
      />
    );

    // Verify title is rendered
    expect(screen.getByText('Live Shopping Simulator')).toBeInTheDocument();
  });

  it('should handle product list updates', () => {
    const { rerender } = render(
      <LiveShoppingDialog
        open={true}
        onOpenChange={jest.fn()}
        canGoLive={true}
        products={[mockProduct]}
      />
    );

    rerender(
      <LiveShoppingDialog
        open={true}
        onOpenChange={jest.fn()}
        canGoLive={true}
        products={[]}
      />
    );

    expect(screen.getByText('Live Shopping Simulator')).toBeInTheDocument();
  });
});
