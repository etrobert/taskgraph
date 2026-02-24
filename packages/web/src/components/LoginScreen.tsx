import { useState, type FormEventHandler, type PropsWithChildren } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/utils/trpc';
import { useMutation, useQuery } from '@tanstack/react-query';

// TODO: Use shadcn card
function FullScreenCard({
  children,
  className,
}: PropsWithChildren<{ className: string }>) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div
        className={cn(
          className,
          'w-full max-w-md rounded-xl border p-8 shadow-xl',
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const trpc = useTRPC();
  const login = useMutation(trpc.login.mutationOptions());

  const me = useQuery(trpc.me.queryOptions());

  console.log('me', me.data);

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <FullScreenCard className="space-y-4">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button className="w-full" type="submit">
          Log in
        </Button>
      </form>
    </FullScreenCard>
  );
}
