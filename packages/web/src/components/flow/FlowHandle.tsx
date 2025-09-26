import { Handle } from '@xyflow/react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export type FlowHandleProps = ComponentProps<typeof Handle>;

export function FlowHandle({ className, style, ...props }: FlowHandleProps) {
  return (
    <Handle
      className={cn('opacity-0 group-hover:opacity-100', className)}
      style={{
        width: '16px',
        height: '16px',
        background: '#fff',
        border: '2px solid #9ca3af',
        transition: 'opacity 0.1s',
        ...style,
      }}
      {...props}
    />
  );
}
