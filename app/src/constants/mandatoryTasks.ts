export interface MandatoryTask {
  id: string;
  title: string;
  description: string;
  category: 'setup';
}

export const MANDATORY_TASKS: MandatoryTask[] = [
  {
    id: 'mandatory-av-check',
    title: 'Test audio/video equipment',
    description: 'Verify cameras, microphones, and streaming software are working correctly',
    category: 'setup',
  },
  {
    id: 'mandatory-inventory',
    title: 'Confirm product inventory',
    description: 'Ensure all products have sufficient stock for the live session',
    category: 'setup',
  },
  {
    id: 'mandatory-pricing',
    title: 'Review pricing and descriptions',
    description: 'Verify all product prices, discounts, and descriptions are accurate',
    category: 'setup',
  },
];

export const MANDATORY_TASK_IDS = MANDATORY_TASKS.map(t => t.id);
