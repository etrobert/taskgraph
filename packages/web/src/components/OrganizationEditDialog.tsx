import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@/utils/trpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';

interface OrganizationEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: { id: string; name: string } | null;
}

export function OrganizationEditDialog({
  open,
  onOpenChange,
  organization,
}: OrganizationEditDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [name, setName] = useState(organization?.name ?? '');

  const updateOrganization = useMutation(
    trpc.updateOrganization.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.organizations.queryOptions());
        onOpenChange(false);
      },
    }),
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (organization && name.trim()) {
      updateOrganization.mutate({
        id: organization.id,
        updates: { name: name.trim() },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Label>
            Name
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Label>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={name.trim() === '' || updateOrganization.isPending}
            >
              {updateOrganization.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
