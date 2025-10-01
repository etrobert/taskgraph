import { SignIn } from '@clerk/clerk-react';

export function AuthScreen() {
  return (
    <div className="grid h-full place-items-center justify-center">
      <SignIn />
    </div>
  );
}
