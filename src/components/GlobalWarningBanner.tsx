import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function GlobalWarningBanner() {
  const location = useLocation();
  if (location.pathname === '/goodbye') return null;
  return (
    <div className="w-full z-50 bg-primary/90 text-primary-foreground shadow-lg px-4 py-2 text-center text-sm font-medium border-b border-primary">
      <span className="font-semibold">This project is no longer maintained.</span> Stock and garden info may be outdated.{' '}
      <Link to="/goodbye" className="underline underline-offset-2 hover:text-accent-foreground transition-colors">Learn more</Link>.
    </div>
  );
}
