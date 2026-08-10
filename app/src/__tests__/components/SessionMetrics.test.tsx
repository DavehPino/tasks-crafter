import { render, screen } from '@testing-library/react';
import { SessionMetrics } from '../../components/SessionMetrics';

describe('SessionMetrics', () => {
  const defaultProps = {
    totalProducts: 10,
    readyProducts: 5,
    totalTasks: 30,
    completedTasks: 15,
    mandatoryCompleted: false,
    isSessionReady: false,
  };

  it('should render products ready metric', () => {
    const { container } = render(<SessionMetrics {...defaultProps} />);
    expect(container.textContent).toContain('Products Ready');
    expect(container.textContent).toContain('5');
    expect(container.textContent).toContain('/10');
  });

  it('should render tasks completed metric', () => {
    const { container } = render(<SessionMetrics {...defaultProps} />);
    expect(container.textContent).toContain('Tasks Completed');
    expect(container.textContent).toContain('15');
    expect(container.textContent).toContain('/30');
  });

  it('should render 50% ready text', () => {
    const { container } = render(<SessionMetrics {...defaultProps} />);
    expect(container.textContent).toContain('50% READY');
  });

  it('should render 50% complete text', () => {
    const { container } = render(<SessionMetrics {...defaultProps} />);
    expect(container.textContent).toContain('50% COMPLETE');
  });

  it('should render disabled button when session is not ready', () => {
    const { container } = render(<SessionMetrics {...defaultProps} />);
    expect(container.textContent).toContain('Complete all tasks to start');
  });

  it('should render enabled button when session is ready and mandatory completed', () => {
    const { container } = render(
      <SessionMetrics
        {...defaultProps}
        mandatoryCompleted={true}
        isSessionReady={true}
      />
    );
    expect(container.textContent).toContain('START LIVE SESSION');
  });

  it('should show 100% when all tasks complete', () => {
    const { container } = render(
      <SessionMetrics
        {...defaultProps}
        completedTasks={30}
        mandatoryCompleted={true}
        isSessionReady={true}
      />
    );
    expect(container.textContent).toContain('100% COMPLETE');
    expect(container.textContent).toContain('START LIVE SESSION');
  });

  it('should show warning badge when mandatory tasks not complete', () => {
    const { container } = render(
      <SessionMetrics
        {...defaultProps}
        mandatoryCompleted={false}
        isSessionReady={true}
      />
    );
    expect(container.textContent).toContain('Pending');
  });

  it('should show success badge when mandatory tasks complete', () => {
    const { container } = render(
      <SessionMetrics
        {...defaultProps}
        mandatoryCompleted={true}
        isSessionReady={true}
      />
    );
    expect(container.textContent).toContain('Complete');
  });
});
