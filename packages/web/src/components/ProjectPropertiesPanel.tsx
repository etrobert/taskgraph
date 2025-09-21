import { SidebarGroup, SidebarGroupContent } from './ui/sidebar';
import type { ProjectNodeType } from './ProjectNode';

interface ProjectPropertiesPanelProps {
  selectedNode: ProjectNodeType;
}

export function ProjectPropertiesPanel({
  selectedNode,
}: ProjectPropertiesPanelProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="grid gap-2">
        <p className="text-muted-foreground text-sm">{selectedNode.id}</p>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

