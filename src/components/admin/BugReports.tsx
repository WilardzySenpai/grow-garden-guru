import { Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export const BugReports = ({ onBack }: { onBack: () => void }) => {
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
                            <Bug className="h-3 w-3" />
                            Bug Reports
                        </Badge>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Bug Reports</h1>
                        <p className="text-muted-foreground">Review and manage user-submitted bug reports</p>
                    </div>
                    {/* Add BugReportManagement component here */}
                </div>
            </div>
        </div>
    );
}
