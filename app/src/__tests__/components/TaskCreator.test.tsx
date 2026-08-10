import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCreator } from '../../components/TaskCreator';

describe('TaskCreator', () => {
  it('should render the form with empty initial state', () => {
    const onAdd = jest.fn();
    render(<TaskCreator onAdd={onAdd} />);

    expect(screen.getByText('Select template')).toBeInTheDocument();
    expect(screen.getByText('Task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Or type a custom task...')).toHaveValue('');
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('should call onAdd with trimmed title when form is submitted', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<TaskCreator onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('Or type a custom task...');
    await user.type(input, 'Test task');
    await user.click(screen.getByText('Add Task'));

    expect(onAdd).toHaveBeenCalledWith('Test task');
  });

  it('should not call onAdd when title is empty', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<TaskCreator onAdd={onAdd} />);

    await user.click(screen.getByText('Add Task'));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<TaskCreator onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('Or type a custom task...');
    await user.type(input, 'Test task');
    await user.click(screen.getByText('Add Task'));

    expect(input).toHaveValue('');
  });

  it('should fill input when template is selected', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();
    render(<TaskCreator onAdd={onAdd} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'setup');

    const input = screen.getByPlaceholderText('Or type a custom task...');
    expect(input).toHaveValue('Setup Live Shopping Environment');
  });

  it('should disable form when loading', () => {
    const onAdd = jest.fn();
    render(<TaskCreator onAdd={onAdd} isLoading={true} />);

    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByPlaceholderText('Or type a custom task...')).toBeDisabled();
    expect(screen.getByText('Adding...')).toBeInTheDocument();
  });
});
