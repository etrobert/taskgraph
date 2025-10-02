import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '../utils/trpc';

export const useOrganizationId = () => {
  const trpc = useTRPC();
  const organizations = useQuery(trpc.organizations.queryOptions());
  const searchParams = new URLSearchParams(window.location.search);
  const orgFromUrl = searchParams.get('org');
  return orgFromUrl || organizations.data?.[0]?.id;
};
