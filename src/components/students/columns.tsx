'use client';
import { ColumnDef } from '@tanstack/react-table';
import { UserProfile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';

export type StudentData = UserProfile & {
    courseTitle: string;
};

export const columns: ColumnDef<StudentData>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback>{student.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{student.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'courseTitle',
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Enrolled Course
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
];
