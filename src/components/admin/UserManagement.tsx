import { useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";

interface UserManagementProps {
    onBack: () => void;
    users: any[];
    loading: boolean;
    fetchUsers: () => void;
}

export const UserManagement = ({ onBack, users, loading, fetchUsers }: UserManagementProps) => {
    useEffect(() => {
        fetchUsers();
    }, []);

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
                            <Users className="h-3 w-3" />
                            User Management
                        </Badge>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Add user management UI here */}
            </div>
        </div>
    );
}
