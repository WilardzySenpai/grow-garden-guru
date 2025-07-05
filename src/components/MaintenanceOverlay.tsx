import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MaintenanceOverlayProps {
  componentName: string;
  className?: string;
}

export const MaintenanceOverlay = ({ componentName, className = '' }: MaintenanceOverlayProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 z-10 backdrop-blur-md bg-background/80 flex items-center justify-center rounded-lg">
        <Card className="border-amber-500/50 bg-amber-500/10">
          <CardContent className="flex flex-col items-center gap-3 p-6">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
            <div className="text-center">
              <h3 className="font-semibold text-foreground">Maintenance Mode</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {componentName} is currently under maintenance
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};