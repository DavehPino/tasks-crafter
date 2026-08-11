import { render } from '@testing-library/react';
import { ProductCardSkeleton } from '../../../components/skeletons/ProductCardSkeleton';

describe('ProductCardSkeleton', () => {
  it('should render without crashing', () => {
    const { container } = render(<ProductCardSkeleton />);
    expect(container).toBeInTheDocument();
  });

  it('should have animated pulse elements', () => {
    const { container } = render(<ProductCardSkeleton />);
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it('should render image skeleton placeholder', () => {
    const { container } = render(<ProductCardSkeleton />);
    const imageSkeleton = container.querySelector('[class*="aspect-square"]');
    expect(imageSkeleton).toBeInTheDocument();
  });

  it('should render title skeleton (multiple lines)', () => {
    const { container } = render(<ProductCardSkeleton />);
    const titleSkeletons = container.querySelectorAll('[class*="h-3"]');
    expect(titleSkeletons.length).toBeGreaterThan(0);
  });

  it('should render price and rating skeletons', () => {
    const { container } = render(<ProductCardSkeleton />);
    const flex = container.querySelector('[class*="flex items-center"]');
    expect(flex).toBeInTheDocument();
  });

  it('should render button skeleton', () => {
    const { container } = render(<ProductCardSkeleton />);
    const buttonSkeleton = container.querySelector('[class*="h-8"]');
    expect(buttonSkeleton).toBeInTheDocument();
  });

  it('should have card structure', () => {
    const { container } = render(<ProductCardSkeleton />);
    const card = container.querySelector('[class*="overflow-hidden"]');
    expect(card).toBeInTheDocument();
  });

  it('should accept index prop for staggered animation', () => {
    const { container } = render(<ProductCardSkeleton index={5} />);
    expect(container).toBeInTheDocument();
  });

  it('should have proper spacing in content area', () => {
    const { container } = render(<ProductCardSkeleton />);
    const contentArea = container.querySelector('[class*="space-y-3"]');
    expect(contentArea).toBeInTheDocument();
  });
});
