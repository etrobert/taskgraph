import { useEffect } from 'react';
import { useKnownOrganizations } from './useKnownOrganizations';
import { useOrganizationId } from './useOrganizationId';

export function usePageTitle() {
  const organizationId = useOrganizationId();
  const organizations = useKnownOrganizations();

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
