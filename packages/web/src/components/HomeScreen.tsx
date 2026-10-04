import { Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { FullScreenCard } from './FullScreenCard';
import { useKnownOrganizations } from '@/hooks/useKnownOrganizations';
import { useCreateOrganization } from '@/hooks/useCreateOrganization';

export function HomeScreen() {
  const organizations = useKnownOrganizations();
  const createOrganization = useCreateOrganization();

  return (
    <FullScreenCard>
      <h1 className="text-2xl font-semibold">TaskGraph</h1>
      {organizations.data?.map((organization) => (
        <a
          key={organization.id}
          href={`?org=${organization.id}`}
          className="hover:bg-accent flex items-center gap-2 rounded-md p-2"
        >
          <Building2 size={16} />
          {organization.name}
        </a>
      ))}
      <Button
        className="w-full"
        onClick={() => createOrganization.mutate()}
        disabled={createOrganization.isPending}
      >
        {createOrganization.isPending ? 'Creating...' : 'New Organization'}
      </Button>
      <p className="text-muted-foreground text-sm">
        Anyone with an organization's link can open and edit it.
      </p>
    </FullScreenCard>
  );
}
