import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { useTRPC } from '@/utils/trpc';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Building2, Plus } from 'lucide-react';
import { useOrganizationId } from '../hooks/useOrganizationId';

export function AppSidebar() {
  const trpc = useTRPC();
  const organizations = useQuery(trpc.organizations.queryOptions());
  const currentOrgId = useOrganizationId();

  const createOrganization = useMutation(
    trpc.createOrganization.mutationOptions({
      onSuccess: (newOrg) => {
        const url = new URL(window.location.href);
        url.searchParams.set('org', newOrg.id);
        window.location.href = url.toString();
      },
    }),
  );

  const handleOrgSwitch = (orgId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('org', orgId);
    window.location.href = url.toString();
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">TaskGraph</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Organizations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {organizations.data?.map((organization) => (
                <SidebarMenuItem key={organization.id}>
                  <SidebarMenuButton
                    onClick={() => handleOrgSwitch(organization.id)}
                    isActive={currentOrgId === organization.id}
                  >
                    <Building2 size={16} />
                    <span>Org {organization.id.slice(0, 8)}...</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => createOrganization.mutate()}
                  disabled={createOrganization.isPending}
                >
                  <Plus size={16} />
                  <span>
                    {createOrganization.isPending
                      ? 'Creating...'
                      : 'New Organization'}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
