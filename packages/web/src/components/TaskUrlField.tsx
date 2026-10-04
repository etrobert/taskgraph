import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTRPC } from '../utils/trpc';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface TaskUrlFieldProps {
  nodeId: string;
  url: string | null;
}

export function TaskUrlField({ nodeId, url }: TaskUrlFieldProps) {
  const trpc = useTRPC();
  const [draftUrl, setDraftUrl] = useState<string>();
  const updateTaskDetails = useMutation(
    trpc.updateTaskDetails.mutationOptions(),
  );

  return (
    <>
      <Label htmlFor="task-url">Link</Label>
      <Input
        id="task-url"
        type="url"
        placeholder="https://"
        value={draftUrl ?? url ?? ''}
        aria-invalid={updateTaskDetails.isError}
        onChange={(e) => setDraftUrl(e.target.value)}
        onBlur={() => {
          if (draftUrl === undefined) return;
          updateTaskDetails.mutate(
            { nodeId, updates: { url: draftUrl || null } },
            { onSuccess: () => setDraftUrl(undefined) },
          );
        }}
      />
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="truncate text-sm text-blue-600 hover:underline"
        >
          {url}
        </a>
      )}
    </>
  );
}
