"use client";

import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Checkbox } from "@/components/admin/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { type BookingActionData, BookingActions } from "./booking-actions";

export type CallBooking = BookingActionData & {
  createdAt: string;
};

const statusVariant = {
  pending: "secondary",
  confirmed: "default",
  cancelled: "outline",
} as const;

export const columns: ColumnDef<CallBooking>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "topic",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Topic
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-[260px]">
        <div className="font-medium">{row.original.topic}</div>
        {row.original.message && (
          <div className="line-clamp-2 text-muted-foreground text-xs">{row.original.message}</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <a
          className="text-muted-foreground text-xs hover:underline"
          href={`mailto:${row.original.email}`}
        >
          {row.original.email}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "preferredDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Preferred Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <div>{row.original.preferredDate}</div>
        <div className="text-muted-foreground text-xs">
          {row.original.preferredTime} {row.original.timezone}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <BookingActions booking={row.original} />,
  },
];
