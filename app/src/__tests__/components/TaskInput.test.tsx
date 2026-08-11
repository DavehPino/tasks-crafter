import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskInput } from '../../components/TaskInput';

describe('TaskInput', () => {
  it('should render input field and submit button', () => {
    const onAdd = jest.fn();
    render(<TaskInput onAdd={onAdd} />);

    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('should call onAdd with trimmed value when form is submitted', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<TaskInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, '  Test task  ');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledWith('Test task');
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('should not call onAdd when input is empty', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<TaskInput onAdd={onAdd} />);

    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('should not call onAdd when input only contains whitespace', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<TaskInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('should clear input after successful submission', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<TaskInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement;
    await user.type(input, 'Test task');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(input.value).toBe('');
  });

  it('should submit on Enter key press', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<TaskInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, 'Test task{Enter}');

    expect(onAdd).toHaveBeenCalledWith('Test task');
  });

  it('should disable input and button when loading', () => {
    const onAdd = jest.fn();
    render(<TaskInput onAdd={onAdd} isLoading={true} />);

    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement;
    const button = screen.getByRole('button');

    expect(input.disabled).toBe(true);
    expect(button.disabled).toBe(true);
  });

  it('should show loading state text', () => {
    const onAdd = jest.fn();
    render(<TaskInput onAdd={onAdd} isLoading={true} />);

    expect(screen.getByText('Adding...')).toBeInTheDocument();
  });

  it('should disable submit button when input is empty', () => {
    const onAdd = jest.fn();
    render(<TaskInput onAdd={onAdd} />);

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should enable submit button when input has value', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<TaskInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('Add a new task...');
    const button = screen.getByRole('button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);

    await user.type(input, 'Test');

    expect(button.disabled).toBe(false);
  });

  it('should allow multiple task additions in sequence', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<TaskInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('Add a new task...');
    const button = screen.getByRole('button', { name: 'Add' });

    // First task
    await user.type(input, 'Task 1');
    await user.click(button);
    expect(onAdd).toHaveBeenCalledWith('Task 1');

    // Second task
    await user.type(input, 'Task 2');
    await user.click(button);
    expect(onAdd).toHaveBeenCalledWith('Task 2');

    expect(onAdd).toHaveBeenCalledTimes(2);
  });
});
