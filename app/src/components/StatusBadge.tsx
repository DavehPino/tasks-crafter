import type { Task } from '../schemas/task';

type TaskStatus = Task['status'];

interface Props {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: '⬜',
    className: 'bg-gray-100 text-gray-700',
  },
  'in-progress': {
    label: 'In Progress',
    icon: '🟡',
    className: 'bg-yellow-100 text-yellow-700',
  },
  completed: {
    label: 'Ready',
    icon: '🟢',
    className: 'bg-green-100 text-green-700',
  },
};

// Map pending to pending, completed to ready
const getStatusDisplay = (status: TaskStatus) => {
  if (status === 'completed') {
    return statusConfig.completed;
  }
  return statusConfig.pending;
};

export const StatusBadge = ({ status, size = 'sm' }: Props) => {
  const config = getStatusDisplay(status);
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';

  return (
    <span className={`inline-block rounded font-medium ${sizeClass} ${config.className}`}>
      {config.icon} {config.label}
    </span>
  );
};
