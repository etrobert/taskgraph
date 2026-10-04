import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/utils/trpc';
import { readStorage, writeStorage } from '@/lib/storage';
import { useOrganizationId } from './useOrganizationId';

const key = 'taskgraph:organizations';

function readIds(): string[] {
  const raw = readStorage(key);
  if (raw === null) return [];
  try {
    const ids: unknown = JSON.parse(raw);
    return Array.isArray(ids) ? ids.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

// The server never lists organizations: this browser's history is the way back.
export function useKnownOrganizations() {
  const trpc = useTRPC();
  const current = useOrganizationId();
  const stored = readIds();
  const ids =
    current === undefined || stored.includes(current)
      ? stored
      : [...stored, current];

  useEffect(() => {
    if (current !== undefined && !readIds().includes(current))
      writeStorage(key, JSON.stringify([...readIds(), current]));
  }, [current]);

  return useQuery(trpc.organizations.queryOptions({ ids }));
}
