import { useQuery } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';
import { useEffect } from 'react';

export function ApiStatusIndicator() {
  const { data, isPending, isError } = useQuery(trpc.health.queryOptions());

  const { data: users } = useQuery(trpc.users.queryOptions());

  useEffect(() => console.log('users changed:', users), [users]);

  function getOutput() {
    if (isError) return '❌ Error';
    if (isPending) return '⏳ Loading...';
    return '✅ ' + data;
  }

  return (
    <div className="fixed top-4 right-4 z-50 rounded bg-gray-800 px-3 py-1 text-sm text-white">
      {getOutput()}
    </div>
  );
}
