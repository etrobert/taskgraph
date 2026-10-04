export const useOrganizationId = () =>
  new URLSearchParams(window.location.search).get('org') ?? undefined;
