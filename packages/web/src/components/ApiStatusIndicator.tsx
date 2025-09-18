import { useTRPC } from '../utils/trpc';
import { useQuery } from '@tanstack/react-query';

export function ApiStatusIndicator() {
  const trpc = useTRPC();

  const { data, isPending, isError } = useQuery(trpc.health.queryOptions());

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
