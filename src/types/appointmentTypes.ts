import { z } from "zod";
import { sales_managers, slots } from "@prisma/client";

export const AppointmentQuerySchema = z.object({
  date: z.string().date(),
  products: z.array(z.string()).nonempty(),
  language: z.enum(["German", "English"]),
  rating: z.enum(["Gold", "Silver", "Bronze"]),
});

export interface AvailableSlot {
  available_count: number;
  start_date: string;
}

export type SalesManagerWithSlots = sales_managers & { slots: slots[] };
