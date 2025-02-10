import { getSalesManagersWithSlots } from "../db/db.helper";
import { AvailableSlot, SalesManagerWithSlots, Slot } from "../types/appointmentTypes";

export const getAvailableSlots = async (date: string, products: string[], language: string, rating: string): Promise<AvailableSlot[]> => {
  const salesManagersWithSlots: SalesManagerWithSlots[] = await getSalesManagersWithSlots(date, products, language, rating);
  const availableSlots: {[k: string]: AvailableSlot} = {};

  salesManagersWithSlots.forEach((manager) => {
    if (!manager.slots || manager.slots.length === 0) {
      return;
    }

    let bookedUntil: Date = new Date(date);

    manager.slots.forEach((slot: Slot, i) => {
      if (slot.booked) {
        bookedUntil = slot.end_date;
        return;
      }

      if (!isSlotAvailable(bookedUntil, slot, manager.slots[i + 1])) {
        return;
      }

      const startDate = slot.start_date.toISOString();

      if (startDate in availableSlots) {
        availableSlots[startDate].available_count += 1; 
      } else {
        availableSlots[startDate] = {
          available_count: 1,
          start_date: startDate,
        }
      }
    })
  });

  return Object.values(availableSlots);
}

const isSlotAvailable = (bookedUntil: Date, slot: Slot, nextSlot: Slot): boolean => {
  if (bookedUntil > slot.start_date) {
    return false;
  }

  const isNextSlotOverlapped = nextSlot?.booked && slot.end_date > nextSlot.start_date;
  if (isNextSlotOverlapped) {
    return false;
  }

  return true;
}