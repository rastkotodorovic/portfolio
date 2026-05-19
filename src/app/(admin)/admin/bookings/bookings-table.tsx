"use client";

import { DataTable } from "@/components/admin/data-table";
import { type CallBooking, columns } from "./columns";

interface BookingsTableProps {
  initialData: CallBooking[];
}

export function BookingsTable({ initialData }: BookingsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={initialData}
      searchKey="topic"
      searchPlaceholder="Search topics..."
    />
  );
}
