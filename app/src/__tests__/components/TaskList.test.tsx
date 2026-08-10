import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from '../../components/TaskList';
import type { Task } from '../../schemas/task';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    status: 'pending',
    createdAt: '2026-08-06T00:00:00.000Z',
    updatedAt: '2026-08-06T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Task 2',
    status: 'completed',
    createdAt: '2026-08-06T00:00:00.000Z',
    updatedAt: '2026-08-06T00:00:00.000Z',
  },
];

describe('TaskList', () => {
  const defaultProps = {
    isLoading: false,
    isError: false,
    selected: new Set<string>(),
    allSelected: false,
    onToggleSelect: jest.fn(),
    onToggleAll: jest.fn(),
    onComplete: jest.fn(),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    render(<TaskList tasks={[]} {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('should render error state', () => {
    render(<TaskList tasks={[]} {...defaultProps} isError={true} />);
    expect(screen.getByText('Failed to load tasks. Is the server running?')).toBeInTheDocument();
  });

  it('should render empty state', () => {
    render(<TaskList tasks={[]} {...defaultProps} />);
    expect(screen.getByText('No tasks yet. Add one above.')).toBeInTheDocument();
  });

  it('should render tasks with select all checkbox', () => {
    render(<TaskList tasks={mockTasks} {...defaultProps} />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Select all')).toBeInTheDocument();
  });

  it('should call onToggleAll when select all is clicked', async () => {
    const user = userEvent.setup();
    const onToggleAll = jest.fn();
    render(
      <TaskList
        tasks={mockTasks}
        {...defaultProps}
        onToggleAll={onToggleAll}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]); // Select all checkbox

    expect(onToggleAll).toHaveBeenCalled();
  });

  it('should show allSelected as checked when all tasks are selected', () => {
    const allSelected = new Set(['1', '2']);
    render(
      <TaskList
        tasks={mockTasks}
        {...defaultProps}
        selected={allSelected}
        allSelected={true}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked(); // Select all checkbox
  });
});
