export function requireEnv(name: string) {
  const value = import.meta.env[name];
  if (!value) throw new Error(`Missing required env ${name}`);
  return value;
}
