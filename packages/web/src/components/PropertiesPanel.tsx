import { type OnSelectionChangeParams } from '@xyflow/react';
import { type CSSProperties } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from './ui/sidebar';
import type { NodeType } from './flow/TaskGraphFlow';
import { TaskPropertiesPanel } from './TaskPropertiesPanel';
import { ProjectPropertiesPanel } from './ProjectPropertiesPanel';

interface PropertiesPanelProps {
  selection: OnSelectionChangeParams<NodeType>;
}

function PropertiesPanelContent({ selection }: PropertiesPanelProps) {
  if (selection.nodes.length === 0)
    return (
      <p className="text-muted-foreground text-sm">
        Select a node to view its properties
      </p>
    );
  if (selection.nodes.length > 1)
    return (
      <p className="text-muted-foreground text-sm">
        {selection.nodes.length} nodes selected
      </p>
    );

  const selectedNode = selection.nodes[0];

  if (selectedNode.type === 'task')
    return <TaskPropertiesPanel selectedNode={selectedNode} />;

  if (selectedNode?.type === 'project')
    return <ProjectPropertiesPanel selectedNode={selectedNode} />;
}

export function PropertiesPanel({ selection }: PropertiesPanelProps) {
  const selectedNode = selection.nodes.at(0);
  return (
    <Sidebar
      collapsible="none"
      side="right"
      style={{ '--sidebar-width': '20rem' } as CSSProperties}
      className="border-l p-3"
    >
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Properties</h2>
      </SidebarHeader>
      <SidebarContent>
        <PropertiesPanelContent selection={selection} />
      </SidebarContent>
      <SidebarFooter>
        {selectedNode && (
          <div className="text-muted-foreground font-mono text-xs">
            {selectedNode.type}: {selectedNode.id.slice(0, 25)}...
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
