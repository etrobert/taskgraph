export function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing requirement env ${name}`);
  return value;
}
