export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  productId?: number;
  category?: string;
  isMandatory?: boolean;
  createdAt: string;
  updatedAt: string;
}
