"use client";

import { Button } from "@/components/admin/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type BookingStatus = "pending" | "confirmed" | "cancelled";

export type BookingActionData = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message?: string;
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  status: BookingStatus;
};

function toGoogleCalendarDate(date: string, time: string) {
  const [start = "09:00", end = "09:30"] = time.split("-");
  const compactDate = date.replaceAll("-", "");
  const compactStart = start.replace(":", "");
  const compactEnd = end.replace(":", "");

  return `${compactDate}T${compactStart}00/${compactDate}T${compactEnd}00`;
}

function getCalendarUrl(booking: BookingActionData) {
  const details = [
    booking.message,
    "",
    `Requested by: ${booking.name} <${booking.email}>`,
    `Timezone: ${booking.timezone}`,
  ]
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Call: ${booking.topic}`,
    dates: toGoogleCalendarDate(booking.preferredDate, booking.preferredTime),
    details,
    add: booking.email,
    ctz: booking.timezone,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function BookingActions({ booking }: { booking: BookingActionData }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (status: BookingStatus) => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update booking");
      }

      toast.success(`Booking marked as ${status}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <a href={getCalendarUrl(booking)} target="_blank" rel="noreferrer">
          Calendar
        </a>
      </Button>
      {booking.status !== "confirmed" && (
        <Button size="sm" onClick={() => updateStatus("confirmed")} disabled={isUpdating}>
          Confirm
        </Button>
      )}
      {booking.status !== "cancelled" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateStatus("cancelled")}
          disabled={isUpdating}
        >
          Cancel
        </Button>
      )}
    </div>
  );
}
