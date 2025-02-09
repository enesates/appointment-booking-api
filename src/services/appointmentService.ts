import { getSalesManagersWithSlots } from "../db/db.helper";
import { AvailableSlot, SalesManagerWithSlots } from "../types/appointmentTypes";

export const getAvailableSlots = async (date: string, products: string[], language: string, rating: string): Promise<AvailableSlot[]> => {
  const salesManagersWithSlots: SalesManagerWithSlots[] = await getSalesManagersWithSlots(date, products, language, rating);
  const availableSlots: {[k: string]: AvailableSlot} = {};

  salesManagersWithSlots.forEach((manager) => {
    if (!manager.slots || manager.slots.length === 0) {
      return;
    }

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