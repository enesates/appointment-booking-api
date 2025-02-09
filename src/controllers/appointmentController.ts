import { Request, Response } from "express";
import { getAvailableSlots } from "../services/appointmentService";
import { AvailableSlot, AppointmentQuerySchema } from "../types/appointmentTypes";


export const getAvailableSlotsHandler = async (req: Request, res: Response): Promise<void> => {
  const validationResult = AppointmentQuerySchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({ errors: validationResult.error.format() });
    return;
  }

  const { date, products, language, rating } = validationResult.data;
    
  try {
    let availableSlots: AvailableSlot[] = await getAvailableSlots(date, products, language, rating);
    res.json(availableSlots);
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};