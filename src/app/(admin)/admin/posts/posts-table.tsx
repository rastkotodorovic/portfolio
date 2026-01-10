"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { columns, type BlogPost } from "./columns";
import { Skeleton } from "@/components/admin/ui/skeleton";

interface PostsTableProps {
  initialData: BlogPost[];
}

export function PostsTable({ initialData }: PostsTableProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="flex items-center py-4">
          <Skeleton className="h-10 w-75" />
          <Skeleton className="h-10 w-25 ml-auto" />
        </div>
        <div className="rounded-md border">
          <div className="h-100 flex items-center justify-center">
            <Skeleton className="h-8 w-50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={initialData}
      searchKey="title"
      searchPlaceholder="Filter posts..."
    />
  );
}
