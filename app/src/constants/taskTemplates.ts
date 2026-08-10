export interface TaskTemplate {
  id: string
  label: string
  description: string
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'setup',
    label: 'Setup Live Shopping Environment',
    description: 'Configure streaming platform, overlays, and graphics',
  },
  {
    id: 'inventory',
    label: 'Verify Inventory & Stock Levels',
    description: 'Check product availability and quantities',
  },
  {
    id: 'payment',
    label: 'Configure Payment Gateway',
    description: 'Test payment processing and checkout flow',
  },
  {
    id: 'stream-test',
    label: 'Test Stream Quality',
    description: 'Verify video bitrate, audio, and latency',
  },
  {
    id: 'brief-team',
    label: 'Brief Team on Session Flow',
    description: 'Align team on timings, products, and promotions',
  },
  {
    id: 'camera',
    label: 'Setup Camera & Lighting',
    description: 'Position cameras and adjust lighting for streaming',
  },
  {
    id: 'products',
    label: 'Load Products to Showcase',
    description: 'Prepare product information and pricing',
  },
  {
    id: 'promo',
    label: 'Activate Promotional Offers',
    description: 'Enable discounts, coupons, and time-limited deals',
  },
  {
    id: 'chat',
    label: 'Enable Live Chat & Moderation',
    description: 'Configure chat system and assign moderators',
  },
  {
    id: 'final-check',
    label: 'Final System Checks',
    description: 'Verify all systems operational before going live',
  },
]
