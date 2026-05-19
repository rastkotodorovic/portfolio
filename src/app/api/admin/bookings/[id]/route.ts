import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCallBookingById, updateCallBooking } from "@/lib/db/bookings";
import { updateCallBookingSchema } from "@/lib/validations/booking";
import type { BookingStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existingBooking = await getCallBookingById(id);

    if (!existingBooking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateCallBookingSchema.parse(body);

    const booking = await updateCallBooking(id, {
      status: validatedData.status as BookingStatus | undefined,
      calendarEventId: validatedData.calendarEventId,
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ message: "Validation failed", errors: error }, { status: 400 });
    }

    return NextResponse.json({ message: "Failed to update booking" }, { status: 500 });
  }
}
