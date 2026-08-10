import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MandatoryTasksChecklist } from '../../components/MandatoryTasksChecklist';

// Mock the API
jest.mock('@/api/tasks', () => ({
  initializeMandatoryTasks: jest.fn(),
  getMandatoryStatus: jest.fn(),
  completeTask: jest.fn(),
}));

import { initializeMandatoryTasks, getMandatoryStatus, completeTask } from '@/api/tasks';

const mockInitializeMandatoryTasks = initializeMandatoryTasks as jest.Mock;
const mockGetMandatoryStatus = getMandatoryStatus as jest.Mock;
const mockCompleteTask = completeTask as jest.Mock;

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('MandatoryTasksChecklist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockInitializeMandatoryTasks.mockResolvedValue({ tasks: [], alreadyInitialized: false });
  });

  it('should render loading skeleton initially', () => {
    mockGetMandatoryStatus.mockReturnValue(new Promise(() => {})); // Never resolves
    const { container } = renderWithQueryClient(<MandatoryTasksChecklist />);
    // Should show animated pulse skeleton
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should render mandatory tasks when loaded', async () => {
    mockGetMandatoryStatus.mockResolvedValue({
      mandatoryTasks: [
        {
          id: 'mandatory-av-check',
          title: 'Test audio/video equipment',
          description: 'Verify cameras, microphones, and streaming software are working correctly',
          status: 'pending',
          isMandatory: true,
        },
        {
          id: 'mandatory-inventory',
          title: 'Confirm product inventory',
          description: 'Ensure all products have sufficient stock for the live session',
          status: 'pending',
          isMandatory: true,
        },
        {
          id: 'mandatory-pricing',
          title: 'Review pricing and descriptions',
          description: 'Verify all product prices, discounts, and descriptions are accurate',
          status: 'pending',
          isMandatory: true,
        },
      ],
      total: 3,
      completed: 0,
      allCompleted: false,
      canGoLive: false,
    });

    renderWithQueryClient(<MandatoryTasksChecklist />);

    await waitFor(() => {
      expect(screen.getByText('Test audio/video equipment')).toBeInTheDocument();
      expect(screen.getByText('Confirm product inventory')).toBeInTheDocument();
      expect(screen.getByText('Review pricing and descriptions')).toBeInTheDocument();
    });
  });

  it('should show completed count', async () => {
    mockGetMandatoryStatus.mockResolvedValue({
      mandatoryTasks: [
        {
          id: 'mandatory-av-check',
          title: 'Test audio/video equipment',
          description: 'Verify cameras, microphones, and streaming software are working correctly',
          status: 'completed',
          isMandatory: true,
        },
        {
          id: 'mandatory-inventory',
          title: 'Confirm product inventory',
          description: 'Ensure all products have sufficient stock for the live session',
          status: 'pending',
          isMandatory: true,
        },
        {
          id: 'mandatory-pricing',
          title: 'Review pricing and descriptions',
          description: 'Verify all product prices, discounts, and descriptions are accurate',
          status: 'pending',
          isMandatory: true,
        },
      ],
      total: 3,
      completed: 1,
      allCompleted: false,
      canGoLive: false,
    });

    renderWithQueryClient(<MandatoryTasksChecklist />);

    await waitFor(() => {
      expect(screen.getByText('1/3')).toBeInTheDocument();
    });
  });

  it('should show warning when not all complete', async () => {
    mockGetMandatoryStatus.mockResolvedValue({
      mandatoryTasks: [
        {
          id: 'mandatory-av-check',
          title: 'Test audio/video equipment',
          description: 'Verify cameras, microphones, and streaming software are working correctly',
          status: 'pending',
          isMandatory: true,
        },
        {
          id: 'mandatory-inventory',
          title: 'Confirm product inventory',
          description: 'Ensure all products have sufficient stock for the live session',
          status: 'pending',
          isMandatory: true,
        },
        {
          id: 'mandatory-pricing',
          title: 'Review pricing and descriptions',
          description: 'Verify all product prices, discounts, and descriptions are accurate',
          status: 'pending',
          isMandatory: true,
        },
      ],
      total: 3,
      completed: 0,
      allCompleted: false,
      canGoLive: false,
    });

    renderWithQueryClient(<MandatoryTasksChecklist />);

    await waitFor(() => {
      expect(screen.getByText(/Complete all tasks to enable/)).toBeInTheDocument();
    });
  });

  it('should call onStatusChange with canGoLive status', async () => {
    const onStatusChange = jest.fn();
    mockGetMandatoryStatus.mockResolvedValue({
      mandatoryTasks: [],
      total: 3,
      completed: 3,
      allCompleted: true,
      canGoLive: true,
    });

    renderWithQueryClient(
      <MandatoryTasksChecklist onStatusChange={onStatusChange} />
    );

    await waitFor(() => {
      expect(onStatusChange).toHaveBeenCalledWith(true);
    });
  });
});
