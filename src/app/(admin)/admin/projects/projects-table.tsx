"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { columns, type Project } from "./columns";
import { Skeleton } from "@/components/admin/ui/skeleton";

interface ProjectsTableProps {
  initialData: Project[];
}

export function ProjectsTable({ initialData }: ProjectsTableProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="flex items-center py-4">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-[100px] ml-auto" />
        </div>
        <div className="rounded-md border">
          <div className="h-[400px] flex items-center justify-center">
            <Skeleton className="h-8 w-[200px]" />
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
      searchPlaceholder="Filter projects..."
    />
  );
}
