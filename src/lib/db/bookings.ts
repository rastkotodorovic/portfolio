import prisma from "@/lib/prisma";
import type { BookingStatus, CallBooking } from "@prisma/client";

export async function getAllCallBookings(): Promise<CallBooking[]> {
  return prisma.callBooking.findMany({
    orderBy: [{ preferredDate: "desc" }, { createdAt: "desc" }],
  });
}

export async function getCallBookingById(id: string): Promise<CallBooking | null> {
  return prisma.callBooking.findUnique({
    where: { id },
  });
}

export async function createCallBooking(data: {
  name: string;
  email: string;
  topic: string;
  message?: string | null;
  preferredDate: Date;
  preferredTime: string;
  timezone: string;
}): Promise<CallBooking> {
  return prisma.callBooking.create({
    data,
  });
}

export async function updateCallBooking(
  id: string,
  data: {
    status?: BookingStatus;
    calendarEventId?: string | null;
  },
): Promise<CallBooking> {
  return prisma.callBooking.update({
    where: { id },
    data,
  });
}
