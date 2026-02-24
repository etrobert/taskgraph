import { useState, type FormEventHandler, type PropsWithChildren } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

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

export function SignupScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    // TODO: Perform account creation
  };

  return (
    <FullScreenCard className="space-y-4">
      <h1 className="text-2xl font-semibold">Create an account</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Jane Doe"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
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
          Create account
        </Button>
      </form>
    </FullScreenCard>
  );
}
