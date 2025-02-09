import { Request, Response } from "express";
import prisma from "../db/prisma";
import { z } from "zod";

// Request body validation schema
const appointmentQuerySchema = z.object({
  date: z.string(),
  products: z.array(z.string()),
  language: z.string(),
  rating: z.string(),
});

export const getAvailableAppointments = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { date, products, language, rating } = appointmentQuerySchema.parse(req.body);
    const slots: {[k: string]: { available_count: number, start_date: string}} = {};

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    
    const salesManagers = await prisma.sales_managers.findMany({
      where: {
        languages: { has: language },
        products: { hasEvery: products },
        customer_ratings: { has: rating },
      },
      include: {
        slots: {
          where: {
            start_date: {
              gte: startOfDay,
            },
            end_date: {
              lte: endOfDay,
            },
          },
          orderBy:{
            start_date: 'asc',
          }
        },
      },
    });

    salesManagers.forEach((manager) => {
      let bookedUntil = manager.slots[0].booked ? manager.slots[0].end_date : manager.slots[0].start_date;

      manager.slots.forEach((slot, i) => {
        if (slot.booked) {
          bookedUntil = slot.end_date;
        }

        if (bookedUntil <= slot.start_date && ((manager.slots.length <= i + 1) || (!manager.slots[i + 1].booked || slot.end_date <= manager.slots[i + 1].start_date))) {
          if (slot.start_date.toISOString() in slots) {
            slots[slot.start_date.toISOString()].available_count += 1; 
          } else {
            slots[slot.start_date.toISOString()] = {
              available_count: 1,
              start_date: slot.start_date.toISOString(),
            }
          }
        }
      })
    });

    let availableSlots = Object.values(slots);

    // const availableSlots = salesManagers.flatMap((manager) =>
    //   manager.slots.map((slot) => (
        
    //     // {
    //     //   available_count: 1,
    //     //   start_date: slot.start_date.toISOString(),
    //     // }
    //   ))
    // );

    res.json(availableSlots);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid request data" });
  }
};