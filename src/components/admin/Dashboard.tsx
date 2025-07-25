import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Bug,
    Database,
    Server,
    Settings,
    Shield,
    Users
} from "lucide-react";

interface DashboardProps {
    onSectionClick: (section: string) => void;
    maintenanceSettings: Record<string, boolean>;
}

export const Dashboard = ({ onSectionClick, maintenanceSettings }: DashboardProps) => {
    const adminSections = [
        {
            icon: Bug,
            title: "Bug Reports",
            description: "View and manage user bug reports",
            color: "text-red-500",
            count: "New",
            id: 'bugs'
        },
        {
            icon: Users,
            title: "User Management",
            description: "View and manage user accounts",
            color: "text-blue-500",
            count: "1,247",
            id: 'users'
        },
        {
            icon: Database,
            title: "Database Overview",
            description: "Monitor database performance and stats",
            color: "text-green-500",
            count: "99.9%",
            id: 'database'
        },
        {
            icon: Activity,
            title: "System Analytics",
            description: "Track system usage and performance",
            color: "text-purple-500",
            count: "Real-time",
            id: 'system'
        },
        {
            icon: Server,
            title: "API Management",
            description: "Monitor API endpoints and usage",
            color: "text-orange-500",
            count: "Active",
            id: 'api'
        },
        {
            icon: BarChart3,
            title: "Market Analytics",
            description: "Advanced market data insights",
            color: "text-indigo-500",
            count: "Live",
            id: 'market'
        },
        {
            icon: AlertTriangle,
            title: "Maintenance Mode",
            description: "Enable/disable app components for maintenance",
            color: "text-amber-500",
            count: Object.values(maintenanceSettings).filter(Boolean).length.toString(),
            id: 'maintenance'
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Shield className="h-10 w-10 text-primary" />
                    <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Comprehensive administration panel for managing the Grow A Garden Guru platform
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold">1,247</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">System Uptime</p>
                                <p className="text-2xl font-bold">99.9%</p>
                            </div>
                            <Activity className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">API Requests</p>
                                <p className="text-2xl font-bold">24.7K</p>
                            </div>
                            <Server className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Sessions</p>
                                <p className="text-2xl font-bold">342</p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Admin Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminSections.map((section) => (
                    <Card 
                        key={section.id}
                        className="hover:shadow-lg transition-all duration-200 hover:scale-105 group cursor-pointer"
                    >
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 p-3 rounded-full bg-accent/20 w-fit">
                                <section.icon className={`h-8 w-8 ${section.color} group-hover:scale-110 transition-transform`} />
                            </div>
                            <CardTitle className="text-xl">{section.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-center text-muted-foreground">
                                {section.description}
                            </p>
                            <div className="text-center">
                                <Badge variant="outline">
                                    {section.count}
                                </Badge>
                            </div>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => onSectionClick(section.id)}
                            >
                                Manage
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* System Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        System Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10">
                            <span className="text-sm font-medium">Database</span>
                            <Badge className="bg-green-500 hover:bg-green-600">Healthy</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10">
                            <span className="text-sm font-medium">API Services</span>
                            <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10">
                            <span className="text-sm font-medium">WebSocket</span>
                            <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
