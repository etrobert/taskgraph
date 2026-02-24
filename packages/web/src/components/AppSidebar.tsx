import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTRPC } from '@/utils/trpc';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Building2, Plus, MoreHorizontal } from 'lucide-react';
import { useOrganizationId } from '../hooks/useOrganizationId';
import { useState } from 'react';
import { OrganizationEditDialog } from './OrganizationEditDialog';
import type { Organization } from 'api/db/schema';

export function AppSidebar() {
  const trpc = useTRPC();
  const organizations = useQuery(trpc.organizations.queryOptions());
  const currentOrgId = useOrganizationId();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  // TODO: Fix
  const user = null as { id: string } | null;

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

  const handleOpenEdit = (org: Organization) => {
    setEditingOrg(org);
    setEditDialogOpen(true);
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
                    <span>{organization.name}</span>
                  </SidebarMenuButton>
                  {user?.id === organization.ownerId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem
                          onClick={() => handleOpenEdit(organization)}
                        >
                          <span>Edit</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
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
      <OrganizationEditDialog
        key={editingOrg?.id}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        organization={editingOrg}
      />
    </Sidebar>
  );
}
