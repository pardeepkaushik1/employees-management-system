const { z } = require('zod');

const salarySchema = z.object({
  employee_id: z.number().int().positive(),

  amount: z.number().positive('Salary must be positive'),

  salary_month: z.string().min(1, 'Salary month is required'),

  payment_date: z.string().nullable().optional(),

  payment_status: z.enum(['Paid', 'Pending'])
});

module.exports = salarySchema;