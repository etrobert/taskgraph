import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { trpc } from '@/utils/trpc';
import { useQuery } from '@tanstack/react-query';

export function AppSidebar() {
  const organizations = useQuery(trpc.organizations.queryOptions());

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {organizations.data?.map((organization, index) => (
            <SidebarMenuItem key={organization.id}>
              <SidebarMenuButton>Organization {index + 1}</SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
