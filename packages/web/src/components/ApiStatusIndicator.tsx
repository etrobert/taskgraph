import { useEffect, useState } from 'react';

export function ApiStatusIndicator() {
  const [apiStatus, setApiStatus] = useState<string>('checking...');

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/health`);
        const data = await response.json();
        setApiStatus(`✅ API: ${data.status}`);
      } catch {
        setApiStatus('❌ API: disconnected');
      }
    };

    checkApiHealth();
    const interval = setInterval(checkApiHealth, 10000); // Check every 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 rounded bg-gray-800 px-3 py-1 text-sm text-white">
      {apiStatus}
    </div>
  );
}