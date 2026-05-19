import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllCallBookings } from "@/lib/db/bookings";
import { CalendarClock } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BookingsTable } from "./bookings-table";
import type { CallBooking } from "./columns";

function toDateInputValue(date: Date) {
  return date.toISOString().split("T")[0];
}

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  const bookings = await getAllCallBookings();
  const tableData: CallBooking[] = bookings.map((booking) => ({
    id: booking.id,
    name: booking.name,
    email: booking.email,
    topic: booking.topic,
    message: booking.message ?? undefined,
    preferredDate: toDateInputValue(booking.preferredDate),
    preferredTime: booking.preferredTime,
    timezone: booking.timezone,
    status: booking.status,
    createdAt: booking.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <CalendarClock className="h-7 w-7" />
            Bookings
          </h1>
          <p className="text-muted-foreground">
            Review call requests and add confirmed slots to your calendar.
          </p>
        </div>
      </div>

      <BookingsTable initialData={tableData} />
    </div>
  );
}
