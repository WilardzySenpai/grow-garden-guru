import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GOODBYE_ACK_KEY = 'goodbye_acknowledged';

export default function Goodbye() {
  const navigate = useNavigate();

  const handleUnderstand = () => {
    localStorage.setItem(GOODBYE_ACK_KEY, 'true');
    navigate('/app#market', { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <Card className="max-w-lg w-full shadow-xl border-2 border-primary">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary mb-2">Project No Longer Maintained</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-3 text-base text-muted-foreground">
            This project is no longer actively maintained. Stock and garden information may be outdated or inaccurate.
          </p>
          <p className="mb-3 text-base text-muted-foreground">
            We thank all contributors, especially <span className="font-semibold text-primary">JoshLei</span> and their API, for making this project possible.
          </p>
          <p className="mb-6 text-sm text-muted-foreground">
            Features may break or disappear at any time. For questions or to view the source, visit our repository.
          </p>
          <Button onClick={handleUnderstand} className="w-full md:w-auto">
            Understand
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export { GOODBYE_ACK_KEY };