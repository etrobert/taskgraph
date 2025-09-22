import { useMutation, useQuery } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { useOrganizationId } from '@/hooks/useOrganizationId';
import { SidebarGroup, SidebarGroupContent } from './ui/sidebar';
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
import type { Status } from '@/lib/statusHelpers';

interface ProjectPropertiesPanelProps {
  selectedNode: ProjectNodeType;
}

export function ProjectPropertiesPanel({
  selectedNode,
}: ProjectPropertiesPanelProps) {
  const organizationId = useOrganizationId();
  const { data: graph } = useQuery(
    trpc.graph.queryOptions(
      { organizationId: organizationId! },
      { enabled: !!organizationId },
    ),
  );

  const [lastKeystroke, setLastKeystroke] = useState(0);
  const [projectName, setProjectName] = useState('');

  const updateProject = useMutation(trpc.updateProject.mutationOptions());

  useEffect(() => {
    if (graph === undefined) return;

    const selectedProject = graph.projects.find(
      (project) => project.id === selectedNode.id,
    );
    if (selectedProject && Date.now() - lastKeystroke >= 1000) {
      setProjectName(selectedProject.name);
    }
  }, [graph, lastKeystroke, selectedNode]);

  if (graph === undefined) return null;

  const selectedProject = graph.projects.find(
    (project) => project.id === selectedNode.id,
  );
  if (!selectedProject) return null;

  return (
    <SidebarGroup>
      <SidebarGroupContent className="grid gap-2">
        <Label htmlFor="project-name">Project Name</Label>
        <Input
          id="project-name"
          type="text"
          value={projectName}
          onChange={(e) => {
            setLastKeystroke(Date.now());
            setProjectName(e.target.value);
            updateProject.mutate({
              id: selectedProject.id,
              updates: { name: e.target.value },
            });
          }}
        />
        <Label htmlFor="project-status">Status</Label>
        <Select
          value={selectedProject.status}
          onValueChange={(value: Status) =>
            updateProject.mutate({
              id: selectedProject.id,
              updates: { status: value as Status },
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {selectedProject.archivedAt && (
          <>
            <Label>Archive Information</Label>
            <div className="text-muted-foreground text-sm">
              Archived: {selectedProject.archivedAt.toLocaleString()}
            </div>
          </>
        )}

        {selectedProject.archivedAt && (
          <Button
            variant="outline"
            onClick={() =>
              updateProject.mutate({
                id: selectedProject.id,
                updates: { archivedAt: null },
              })
            }
            disabled={updateProject.isPending}
            className="w-full"
          >
            {updateProject.isPending ? 'Unarchiving...' : 'Unarchive'}
          </Button>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
