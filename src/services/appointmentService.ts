import prisma from "../db/prisma";
import { AvailableSlot } from "../types/appointmentTypes";

export const getAvailableSlots = async (date: string, products: string[], language: string, rating: string): Promise<AvailableSlot[]> => {
  const availableSlots: {[k: string]: AvailableSlot} = {};

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
    let bookedUntil: Date = manager.slots[0].booked ? manager.slots[0].end_date : manager.slots[0].start_date;

    manager.slots.forEach((slot, i) => {
      if (slot.booked) {
        bookedUntil = slot.end_date;
      }

      if (bookedUntil <= slot.start_date && ((manager.slots.length <= i + 1) || (!manager.slots[i + 1].booked || slot.end_date <= manager.slots[i + 1].start_date))) {
        if (slot.start_date.toISOString() in availableSlots) {
          availableSlots[slot.start_date.toISOString()].available_count += 1; 
        } else {
          availableSlots[slot.start_date.toISOString()] = {
            available_count: 1,
            start_date: slot.start_date.toISOString(),
          }
        }
      }
    })
  });

  return Object.values(availableSlots);
}