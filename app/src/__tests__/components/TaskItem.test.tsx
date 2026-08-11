import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskItem } from '../../components/TaskItem';
import type { Task } from '../../schemas/task';

const mockTask: Task = {
  id: '1',
  title: 'Test task',
  status: 'pending',
  isMandatory: false,
  createdAt: '2026-08-06T00:00:00.000Z',
  updatedAt: '2026-08-06T00:00:00.000Z',
};

const completedTask: Task = {
  ...mockTask,
  status: 'completed',
};

const mandatoryTask: Task = {
  ...mockTask,
  isMandatory: true,
};

describe('TaskItem', () => {
  const defaultProps = {
    onToggleSelect: jest.fn(),
    onComplete: jest.fn(),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task title and action buttons', () => {
    render(
      <TaskItem
        task={mockTask}
        isSelected={false}
        {...defaultProps}
      />
    );

    expect(screen.getByText('Test task')).toBeInTheDocument();
    expect(screen.getByLabelText('Mark as completed')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit task')).toBeInTheDocument();
  });

  it('should show delete button when task is completed', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();
    render(
      <TaskItem
        task={completedTask}
        isSelected={false}
        {...defaultProps}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByLabelText('Delete task'));
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('should call onComplete when complete button is clicked', async () => {
    const user = userEvent.setup();
    const onComplete = jest.fn();
    render(
      <TaskItem
        task={mockTask}
        isSelected={false}
        {...defaultProps}
        onComplete={onComplete}
      />
    );

    await user.click(screen.getByLabelText('Mark as completed'));
    expect(onComplete).toHaveBeenCalledWith('1');
  });

  it('should call onToggleSelect when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggleSelect = jest.fn();
    render(
      <TaskItem
        task={mockTask}
        isSelected={false}
        {...defaultProps}
        onToggleSelect={onToggleSelect}
      />
    );

    await user.click(screen.getByRole('checkbox'));
    expect(onToggleSelect).toHaveBeenCalledWith('1');
  });

  it('should not show complete and edit buttons for completed tasks', () => {
    render(
      <TaskItem
        task={completedTask}
        isSelected={false}
        {...defaultProps}
      />
    );

    expect(screen.queryByLabelText('Mark as completed')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Edit task')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Delete task')).toBeInTheDocument();
  });

  it('should enter edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        task={mockTask}
        isSelected={false}
        {...defaultProps}
      />
    );

    await user.click(screen.getByLabelText('Edit task'));
    expect(screen.getByDisplayValue('Test task')).toBeInTheDocument();
  });
});
