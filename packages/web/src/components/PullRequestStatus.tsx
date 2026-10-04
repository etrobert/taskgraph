import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '../utils/trpc';
import { cn } from '@/lib/utils';

const minute = 60 * 1000;

const stateColor = {
  open: 'bg-green-600',
  draft: 'bg-gray-500',
  merged: 'bg-purple-600',
  closed: 'bg-red-600',
};

const ciIcon = { passing: '✅', failing: '❌', running: '🟡' };

export function PullRequestStatus({ url }: { url: string }) {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.pullRequestStatus.queryOptions({ url }, { refetchInterval: minute }),
  );

  if (!data) return null;

  return (
    <span className="flex shrink-0 items-center gap-1 text-xs">
      <span
        className={cn('rounded-full px-1.5 text-white', stateColor[data.state])}
      >
        {data.state}
      </span>
      {data.ci && <span title={`CI ${data.ci}`}>{ciIcon[data.ci]}</span>}
    </span>
  );
}
