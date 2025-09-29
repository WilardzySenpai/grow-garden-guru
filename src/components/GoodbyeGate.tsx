import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GOODBYE_ACK_KEY } from '@/pages/Goodbye';

/**
 * This component enforces the Goodbye page on first visit.
 * Place it at the top of App, inside BrowserRouter, so it runs on every route.
 */
export default function GoodbyeGate() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const acknowledged = localStorage.getItem(GOODBYE_ACK_KEY) === 'true';
    // If not acknowledged and not already on /goodbye, redirect
    if (!acknowledged && location.pathname !== '/goodbye') {
      navigate('/goodbye', { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
}
