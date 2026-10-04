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
import { Building2, Plus, MoreHorizontal } from 'lucide-react';
import { useOrganizationId } from '../hooks/useOrganizationId';
import { useKnownOrganizations } from '../hooks/useKnownOrganizations';
import { useCreateOrganization } from '../hooks/useCreateOrganization';
import { useState } from 'react';
import { OrganizationEditDialog } from './OrganizationEditDialog';
import { Button } from './ui/button';
import type { Organization, User } from 'api/db/schema';

interface AppSidebarProps {
  currentUser: User;
  onSwitchUser: () => void;
}

export function AppSidebar({ currentUser, onSwitchUser }: AppSidebarProps) {
  const organizations = useKnownOrganizations();
  const currentOrgId = useOrganizationId();
  const createOrganization = useCreateOrganization();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

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
        <div className="flex items-center justify-between gap-2 px-4">
          <span className="truncate text-sm">{currentUser.name}</span>
          <Button variant="ghost" size="sm" onClick={onSwitchUser}>
            Switch
          </Button>
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
                    asChild
                    isActive={currentOrgId === organization.id}
                  >
                    <a href={`?org=${organization.id}`}>
                      <Building2 size={16} />
                      <span>{organization.name}</span>
                    </a>
                  </SidebarMenuButton>
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
