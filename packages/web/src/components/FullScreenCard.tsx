import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export function FullScreenCard({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div
        className={cn(
          className,
          'w-full max-w-md space-y-4 rounded-xl border p-8 shadow-xl',
        )}
      >
        {children}
      </div>
    </div>
  );
}
