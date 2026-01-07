import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Temel Skeleton bileşeni
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

/**
 * Form alanı için skeleton
 */
export function FormFieldSkeleton({ label = true }: { label?: boolean }) {
  return (
    <div className="space-y-2">
      {label && <Skeleton className="h-4 w-24" />}
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

/**
 * Kart için skeleton
 */
export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

/**
 * Tablo için skeleton
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="bg-muted p-3 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-3 flex gap-4 border-t">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Makale editörü için skeleton
 */
export function EditorSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar skeleton */}
      <div className="h-14 border-b bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar skeleton */}
        <div className="w-56 bg-sidebar border-r p-4 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full bg-sidebar-accent" />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <FormFieldSkeleton />
          <FormFieldSkeleton />
          <FormFieldSkeleton />
          <div className="pt-4">
            <Skeleton className="h-32 w-full" />
          </div>
        </div>

        {/* Preview skeleton */}
        <div className="w-1/2 bg-muted/30 p-6">
          <div className="bg-white shadow-lg mx-auto max-w-[210mm] min-h-[297mm] p-8 space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PDF önizleme için skeleton
 */
export function PdfPreviewSkeleton() {
  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-12 border-b bg-muted/50 flex items-center justify-between px-4">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-7" />
        </div>
      </div>
      
      {/* Paper */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white shadow-xl mx-auto max-w-[210mm] min-h-[297mm] p-8 space-y-6">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          
          <div className="bg-muted/30 p-4 rounded space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          
          <div className="columns-2 gap-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="break-inside-avoid space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Liste öğesi için skeleton
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 border-b">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

/**
 * Yazar kartı için skeleton
 */
export function AuthorCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-8 w-8" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

