import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/utils/trpc';
import { useOrganizationId } from './useOrganizationId';

export function usePageTitle() {
  const trpc = useTRPC();
  const organizationId = useOrganizationId();
  const organizations = useQuery(trpc.organizations.queryOptions());

  useEffect(() => {
    const currentOrg = organizations.data?.find(
      (org) => org.id === organizationId,
    );
    if (currentOrg) {
      document.title = `${currentOrg.name} - TaskGraph`;
    } else {
      document.title = 'TaskGraph';
    }
  }, [organizationId, organizations.data]);
}
