import { z } from "zod";

export const bookingStatusSchema = z.enum(["pending", "confirmed", "cancelled"]);

export const callBookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(200, "Email is too long"),
  topic: z.string().trim().min(1, "Topic is required").max(160, "Topic is too long"),
  message: z.string().trim().max(1000, "Message must be less than 1000 characters").optional(),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().trim().min(1, "Preferred time is required").max(40),
  timezone: z.string().trim().min(1, "Timezone is required").max(80),
  website: z.string().optional(),
});

export const updateCallBookingSchema = z.object({
  status: bookingStatusSchema.optional(),
  calendarEventId: z.string().trim().max(200).optional().nullable(),
});

export type CallBookingFormData = z.infer<typeof callBookingSchema>;
