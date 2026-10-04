import { useMutation } from '@tanstack/react-query';
import { useTRPC } from '../utils/trpc';
import { Label } from './ui/label';

interface TaskImportantFieldProps {
  nodeId: string;
  important: boolean;
}

export function TaskImportantField({
  nodeId,
  important,
}: TaskImportantFieldProps) {
  const trpc = useTRPC();
  const updateTaskDetails = useMutation(
    trpc.updateTaskDetails.mutationOptions(),
  );

  return (
    <Label>
      <input
        type="checkbox"
        checked={important}
        onChange={(e) =>
          updateTaskDetails.mutate({
            nodeId,
            updates: { important: e.target.checked },
          })
        }
      />
      Important
    </Label>
  );
}
