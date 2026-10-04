import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/utils/trpc';
import { readStorage, writeStorage } from '@/lib/storage';

// Who is at this browser, per organization; not authentication.
export function useCurrentUser(organizationId: string) {
  const trpc = useTRPC();
  const key = `taskgraph:user:${organizationId}`;
  const users = useQuery(trpc.users.queryOptions({ organizationId }));
  const [userId, setUserId] = useState(() => readStorage(key));

  const select = (id: string | null) => {
    writeStorage(key, id);
    setUserId(id);
  };

  const user = users.data?.find((user) => user.id === userId && !user.isAi);

  return { users, user, select };
}
