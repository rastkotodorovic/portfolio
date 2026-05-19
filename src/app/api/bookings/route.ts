import { createCallBooking } from "@/lib/db/bookings";
import { callBookingSchema } from "@/lib/validations/booking";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = callBookingSchema.parse(body);

    if (validatedData.website) {
      return NextResponse.json({ message: "Booking request received" }, { status: 201 });
    }

    const preferredDate = new Date(`${validatedData.preferredDate}T00:00:00.000Z`);

    if (Number.isNaN(preferredDate.getTime())) {
      return NextResponse.json({ message: "Invalid preferred date" }, { status: 400 });
    }

    const booking = await createCallBooking({
      name: validatedData.name,
      email: validatedData.email,
      topic: validatedData.topic,
      message: validatedData.message || null,
      preferredDate,
      preferredTime: validatedData.preferredTime,
      timezone: validatedData.timezone,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ message: "Validation failed", errors: error }, { status: 400 });
    }

    return NextResponse.json({ message: "Failed to create booking request" }, { status: 500 });
  }
}
