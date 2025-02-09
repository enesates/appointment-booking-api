import { z } from "zod";

export const AppointmentQuerySchema = z.object({
  date: z.string(),
  products: z.array(z.string()),
  language: z.enum(["German", "English"]),
  rating: z.enum(["Gold", "Silver", "Bronze"]),
});

export interface AvailableSlot {
  available_count: number;
  start_date: string;
}