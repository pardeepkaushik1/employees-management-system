const { z } = require('zod');

const attendanceSchema = z.object({
  employee_id: z.number().int().positive(),

  attendance_date: z.string().min(1, 'Attendance date is required'),

  check_in: z.string().nullable().optional(),

  check_out: z.string().nullable().optional(),

  status: z.enum(['Present', 'Absent', 'Leave', 'Half Day'])
}).superRefine((attendance, ctx) => {
  if (attendance.status !== 'Present') {
    return;
  }

  if (!attendance.check_in?.trim()) {
    ctx.addIssue({
      code: 'custom',
      path: ['check_in'],
      message: 'Check-in time is required for present attendance'
    });
  }

  if (!attendance.check_out?.trim()) {
    ctx.addIssue({
      code: 'custom',
      path: ['check_out'],
      message: 'Check-out time is required for present attendance'
    });
  }
});

module.exports = attendanceSchema;