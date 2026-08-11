import { render } from '@testing-library/react';
import { PageSkeleton } from '../../../components/skeletons/PageSkeleton';

describe('PageSkeleton', () => {
  it('should render without crashing', () => {
    const { container } = render(<PageSkeleton />);
    expect(container).toBeInTheDocument();
  });

  it('should render with background color', () => {
    const { container } = render(<PageSkeleton />);
    const minHeightDiv = container.querySelector('.min-h-screen');
    expect(minHeightDiv).toBeInTheDocument();
  });

  it('should contain multiple pulse animations for loading effect', () => {
    const { container } = render(<PageSkeleton />);
    const animatedElements = container.querySelectorAll('.animate-pulse');
    expect(animatedElements.length).toBeGreaterThan(5);
  });

  it('should have a grid layout for products', () => {
    const { container } = render(<PageSkeleton />);
    const gridDivs = container.querySelectorAll('[class*="grid"]');
    expect(gridDivs.length).toBeGreaterThan(0);
  });

  it('should render multiple card containers', () => {
    const { container } = render(<PageSkeleton />);
    const borderElements = container.querySelectorAll('[class*="border"]');
    expect(borderElements.length).toBeGreaterThan(0);
  });

  it('should render skeletal placeholders for content', () => {
    const { container } = render(<PageSkeleton />);
    const placeholders = container.querySelectorAll('[class*="rounded"]');
    expect(placeholders.length).toBeGreaterThan(0);
  });
});
