import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface DatabaseOverviewProps {
    onBack: () => void;
    dbStats: any;
    loading: boolean;
    fetchDatabaseStats: () => void;
}

export const DatabaseOverview = ({ onBack, dbStats, loading, fetchDatabaseStats }: DatabaseOverviewProps) => {
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
                            <Database className="h-3 w-3" />
                            Database Overview
                        </Badge>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Add database overview content here */}
                </div>
            </div>
        </div>
    );
}
