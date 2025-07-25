import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface MaintenanceModeProps {
    onBack: () => void;
    settings: Record<string, boolean>;
    showMaintenanceAsAdmin: boolean;
    setShowMaintenanceAsAdmin: (value: boolean) => void;
    isAdmin: boolean;
}

export const MaintenanceMode = ({
    onBack,
    settings,
    showMaintenanceAsAdmin,
    setShowMaintenanceAsAdmin,
    isAdmin
}: MaintenanceModeProps) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
            <header className="border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                onClick={onBack}
                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3" />
                            Maintenance Mode
                        </Badge>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Add maintenance mode content here */}
                </div>
            </div>
        </div>
    );
}
