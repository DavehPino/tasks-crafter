import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../../components/StatusBadge';

describe('StatusBadge', () => {
  it('should render pending status', () => {
    const { container } = render(<StatusBadge status="pending" />);
    expect(container.textContent).toContain('Pending');
  });

  it('should render completed status as Ready', () => {
    const { container } = render(<StatusBadge status="completed" />);
    expect(container.textContent).toContain('Ready');
  });

  it('should render small size by default', () => {
    const { container } = render(<StatusBadge status="pending" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('text-xs');
  });

  it('should render medium size when specified', () => {
    const { container } = render(<StatusBadge status="pending" size="md" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('text-sm');
  });
});
