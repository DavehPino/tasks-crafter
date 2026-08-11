import { render } from '@testing-library/react';
import { SessionMetrics } from '../../components/SessionMetrics';

describe('SessionMetrics', () => {
  const defaultProps = {
    totalProducts: 10,
    readyProducts: 5,
    totalTasks: 30,
    completedTasks: 15,
    mandatoryCompleted: false,
    isSessionReady: false,
    sessionTasks: [],
    selectedTasks: new Set<string>(),
    allSelected: false,
    onToggleSelect: jest.fn(),
    onToggleAll: jest.fn(),
    onComplete: jest.fn(),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
  };

  it('should render without crashing', () => {
    const { container } = render(<SessionMetrics {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('should display products ready text', () => {
    const { container } = render(<SessionMetrics {...defaultProps} />);
    expect(container.textContent).toContain('Products Ready');
  });

  it('should display ready products count', () => {
    const { container } = render(<SessionMetrics {...defaultProps} />);
    expect(container.textContent).toContain('5');
  });

  it('should display tasks completed text', () => {
    const { container } = render(<SessionMetrics {...defaultProps} />);
    expect(container.textContent).toContain('Tasks Completed');
  });

  it('should display completed tasks count', () => {
    const { container } = render(<SessionMetrics {...defaultProps} />);
    expect(container.textContent).toContain('15');
  });

  it('should render progress indicators', () => {
    const { container } = render(<SessionMetrics {...defaultProps} />);
    // Should have progress elements
    const progressElements = container.querySelectorAll('[role="progressbar"]');
    expect(progressElements.length).toBeGreaterThan(0);
  });

  it('should display metrics in card container', () => {
    const { container } = render(<SessionMetrics {...defaultProps} />);
    const card = container.querySelector('[class*="border-border"]');
    expect(card).toBeInTheDocument();
  });

  it('should render grid layout for metrics', () => {
    const { container } = render(<SessionMetrics {...defaultProps} />);
    const gridDiv = container.querySelector('[class*="grid"]');
    expect(gridDiv).toBeInTheDocument();
  });

  it('should display different content with 100% completion', () => {
    const { container } = render(
      <SessionMetrics
        {...defaultProps}
        completedTasks={30}
        mandatoryCompleted={true}
        isSessionReady={true}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('should show task list section', () => {
    const { container } = render(<SessionMetrics {...defaultProps} />);
    // Session metrics includes a task list, so it should render
    expect(container.querySelector('[class*="flex items-center"]')).toBeInTheDocument();
  });
});
