import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { requireEnv } from './utils/requireEnv.ts';
import { ClerkProvider } from '@clerk/clerk-react';

// Import your Publishable Key
const CLERK_PUBLISHABLE_KEY = requireEnv('VITE_CLERK_PUBLISHABLE_KEY');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </StrictMode>,
);
