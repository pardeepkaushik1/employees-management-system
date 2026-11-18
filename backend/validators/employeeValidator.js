const { z } = require('zod');

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  email: z.string().email('Invalid email'),

  phone: z.string().optional(),

  address: z.string().optional(),

  salary: z.number().positive('Salary must be positive'),

  department_id: z.number().int().positive(),

  joining_date: z.string().min(1, 'Joining date is required')
});

module.exports = employeeSchema;
