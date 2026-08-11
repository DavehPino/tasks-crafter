import { render } from '@testing-library/react';
import { TaskListSkeleton } from '../../../components/skeletons/TaskListSkeleton';

describe('TaskListSkeleton', () => {
  it('should render without crashing', () => {
    const { container } = render(<TaskListSkeleton />);
    expect(container).toBeInTheDocument();
  });

  it('should render multiple task skeleton items', () => {
    const { container } = render(<TaskListSkeleton />);
    // Should render 5 skeleton tasks
    const taskItems = container.querySelectorAll('[class*="p-3"]');
    expect(taskItems.length).toBeGreaterThan(0);
  });

  it('should have animated pulse elements for loading', () => {
    const { container } = render(<TaskListSkeleton />);
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it('should have border styling', () => {
    const { container } = render(<TaskListSkeleton />);
    const borderedItems = container.querySelectorAll('[class*="border"]');
    expect(borderedItems.length).toBeGreaterThan(0);
  });

  it('should have spacing between skeleton items', () => {
    const { container } = render(<TaskListSkeleton />);
    const spacedDiv = container.querySelector('[class*="space"]');
    expect(spacedDiv).toBeInTheDocument();
  });

  it('should render rounded skeleton boxes', () => {
    const { container } = render(<TaskListSkeleton />);
    const rounded = container.querySelectorAll('[class*="rounded"]');
    expect(rounded.length).toBeGreaterThan(0);
  });
});
