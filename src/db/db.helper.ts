import prisma from "../db/prisma";
import { SalesManagerWithSlots } from "../types/appointmentTypes";

export const getSalesManagersWithSlots = async (date: string, products: string[], language: string, rating: string) => {
  let salesManagersWithSlots: SalesManagerWithSlots[];

  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);
  
  try {
    salesManagersWithSlots = await prisma.sales_managers.findMany({
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
  } catch (error) {
    console.error("DB Error while querying available slots:", error);
    throw new Error("Internal server error.");
  }

  return salesManagersWithSlots;
}