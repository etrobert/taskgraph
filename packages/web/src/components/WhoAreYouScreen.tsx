import { useState, type FormEventHandler } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/utils/trpc';
import type { User } from '@/utils/trpc';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { FullScreenCard } from './FullScreenCard';

interface WhoAreYouScreenProps {
  organizationId: string;
  users: User[];
  onSelect: (userId: string) => void;
}

export function WhoAreYouScreen({
  organizationId,
  users,
  onSelect,
}: WhoAreYouScreenProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const createUser = useMutation(
    trpc.createUser.mutationOptions({
      onSuccess: async (user) => {
        await queryClient.invalidateQueries(
          trpc.users.queryFilter({ organizationId }),
        );
        onSelect(user.id);
      },
    }),
  );

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    createUser.mutate({ organizationId, name });
  };

  return (
    <FullScreenCard>
      <h1 className="text-2xl font-semibold">Who are you?</h1>
      <div className="grid grid-cols-2 gap-2">
        {users
          .filter((user) => !user.isAi)
          .map((user) => (
            <Button
              key={user.id}
              variant="outline"
              onClick={() => onSelect(user.id)}
            >
              {user.name}
            </Button>
          ))}
      </div>
      <form className="flex gap-2" onSubmit={onSubmit}>
        <Input
          aria-label="Your name"
          placeholder="I'm new: my name is…"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Button
          type="submit"
          disabled={name.trim() === '' || createUser.isPending}
        >
          Join
        </Button>
      </form>
    </FullScreenCard>
  );
}
