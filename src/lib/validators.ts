import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Quest title cannot be empty' })
    .max(200, { message: 'Quest title cannot exceed 200 characters' }),
  description: z.string().max(1000).optional().nullable(),
  attribute: z.enum(['strength', 'intellect', 'creativity', 'discipline', 'social']),
  difficulty: z.enum(['trivial', 'easy', 'medium', 'hard', 'epic']),
  recurrence: z.enum(['one_time', 'daily', 'weekly', 'monthly']).default('one_time'),
  due_date: z.string().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  is_completed: z.boolean().optional(),
});

export const completeTaskSchema = z.object({
  taskId: z.string().uuid({ message: 'A valid task ID is required' }),
});

export const purchaseItemSchema = z.object({
  itemId: z.string().uuid({ message: 'A valid item ID is required' }),
});

export const equipItemSchema = z.object({
  itemId: z.string().uuid({ message: 'A valid item ID is required' }),
});
