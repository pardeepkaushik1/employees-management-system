const { z } = require('zod');

const departmentSchema = z.object({
  department_name: z.string().min(1, 'Department name is required')
});

module.exports = departmentSchema;