import { render, screen } from '@testing-library/react';
import { SessionMetrics } from '../../components/SessionMetrics';

describe('SessionMetrics', () => {
  const defaultProps = {
    totalProducts: 10,
    readyProducts: 5,
    totalTasks: 30,
    completedTasks: 15,
    isSessionReady: false,
  };

  it('should render products ready metric', () => {
    render(<SessionMetrics {...defaultProps} />);
    expect(screen.getByText('Products Ready')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('/10')).toBeInTheDocument();
  });

  it('should render tasks completed metric', () => {
    render(<SessionMetrics {...defaultProps} />);
    expect(screen.getByText('Tasks Completed')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('/30')).toBeInTheDocument();
  });

  it('should render 50% ready text', () => {
    render(<SessionMetrics {...defaultProps} />);
    expect(screen.getByText('50% READY')).toBeInTheDocument();
  });

  it('should render 50% complete text', () => {
    render(<SessionMetrics {...defaultProps} />);
    expect(screen.getByText('50% COMPLETE')).toBeInTheDocument();
  });

  it('should render disabled button when session is not ready', () => {
    render(<SessionMetrics {...defaultProps} />);
    const button = screen.getByText('Complete all tasks to start');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should render enabled button when session is ready', () => {
    render(<SessionMetrics {...defaultProps} isSessionReady={true} />);
    const button = screen.getByText('START LIVE SESSION');
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should show 100% when all tasks complete', () => {
    render(
      <SessionMetrics
        {...defaultProps}
        completedTasks={30}
        isSessionReady={true}
      />
    );
    expect(screen.getByText('100% COMPLETE')).toBeInTheDocument();
    expect(screen.getByText('START LIVE SESSION')).toBeInTheDocument();
  });
});
