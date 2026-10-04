import { useMutation, useQuery } from '@tanstack/react-query';
import { useTRPC } from '../utils/trpc';
import { useState } from 'react';
import { Input } from './ui/input';
import { useOrganizationId } from '@/hooks/useOrganizationId';
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from './ui/sidebar';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import type { ProjectNodeType } from './ProjectNode';
import { statusValues, type Status } from 'api/db/schema';

interface ProjectPropertiesPanelProps {
  selectedNode: ProjectNodeType;
}

export function ProjectPropertiesPanel({
  selectedNode,
}: ProjectPropertiesPanelProps) {
  const trpc = useTRPC();
  const organizationId = useOrganizationId();
  const { data: graph } = useQuery(
    trpc.graph.queryOptions(
      { organizationId: organizationId! },
      { enabled: !!organizationId },
    ),
  );

  const [draftName, setDraftName] = useState<string>();

  const updateProjectDetails = useMutation(
    trpc.updateProjectDetails.mutationOptions(),
  );
  const updateNode = useMutation(trpc.updateNode.mutationOptions());

  if (graph === undefined) return null;

  const selectedProject = graph.projects.find(
    (project) => project.id === selectedNode.id,
  );
  if (!selectedProject) return null;

  return (
    <>
      <SidebarHeader>Project Properties</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="grid gap-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              type="text"
              value={draftName ?? selectedProject.name}
              onChange={(e) => {
                setDraftName(e.target.value);
                updateNode.mutate({
                  id: selectedProject.id,
                  updates: { name: e.target.value },
                });
              }}
              onBlur={() => setDraftName(undefined)}
            />
            <Label htmlFor="project-status">Status</Label>
            <Select
              value={selectedProject.status}
              onValueChange={(value: Status) =>
                updateProjectDetails.mutate({
                  id: selectedProject.id,
                  updates: { status: value as Status },
                })
              }
            >
              <SelectTrigger className="w-full capitalize">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusValues.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="capitalize"
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedProject.archivedAt && (
              <>
                <Label>Archive Information</Label>
                <div className="text-muted-foreground text-sm">
                  Archived:{' '}
                  {new Date(selectedProject.archivedAt).toLocaleString()}
                </div>
              </>
            )}

            {selectedProject.archivedAt && (
              <Button
                variant="outline"
                onClick={() =>
                  updateNode.mutate({
                    id: selectedProject.id,
                    updates: { archivedAt: null },
                  })
                }
                disabled={updateNode.isPending}
                className="w-full"
              >
                {updateNode.isPending ? 'Unarchiving...' : 'Unarchive'}
              </Button>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="text-muted-foreground font-mono text-xs whitespace-pre">
          {JSON.stringify(selectedProject, undefined, 2)}
        </div>
      </SidebarFooter>
    </>
  );
}
