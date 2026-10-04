import { useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/utils/trpc';

export function useCreateOrganization() {
  const trpc = useTRPC();
  return useMutation(
    trpc.createOrganization.mutationOptions({
      onSuccess: (organization) => {
        window.location.search = `?org=${organization.id}`;
      },
    }),
  );
}
