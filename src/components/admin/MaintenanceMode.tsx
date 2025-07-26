import { ArrowLeft, Settings, Power, Clock, MessageSquare, Calendar, AlertTriangle, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MaintenanceSettings } from "@/hooks/useMaintenanceMode";

interface MaintenanceModeProps {
    onBack: () => void;
    settings: MaintenanceSettings;
    showMaintenanceAsAdmin: boolean;
    setShowMaintenanceAsAdmin: (show: boolean) => void;
    isAdmin: boolean;
}

export const MaintenanceMode = ({
    onBack,
    settings,
    showMaintenanceAsAdmin,
    setShowMaintenanceAsAdmin,
    isAdmin
}: MaintenanceModeProps) => {
    const [localSettings, setLocalSettings] = useState<MaintenanceSettings>(settings);
    const [saving, setSaving] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState<string>("1h");

    const handleMaintenanceToggle = async (enabled: boolean) => {
        try {
            setSaving(true);
            // Calculate end time based on selected duration if enabling
            let plannedEndTime = null;
            if (enabled) {
                const hours = parseInt(selectedDuration.replace('h', ''));
                const endTime = new Date();
                endTime.setHours(endTime.getHours() + hours);
                plannedEndTime = endTime.toISOString();
            }
            
            setLocalSettings(prev => ({
                ...prev,
                enabled,
                plannedEndTime,
                lastUpdated: new Date().toISOString(),
            }));
            // Here you would typically make an API call to update the settings
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
        } catch (error) {
            console.error('Failed to toggle maintenance mode:', error);
        } finally {
            setSaving(false);
        }
    };

    const updateMessage = (message: string) => {
        setLocalSettings(prev => ({
            ...prev,
            message,
            lastUpdated: new Date().toISOString(),
        }));
    };

    const updateAffectedServices = (service: string) => {
        setLocalSettings(prev => ({
            ...prev,
            affectedServices: prev.affectedServices.includes(service)
                ? prev.affectedServices.filter(s => s !== service)
                : [...prev.affectedServices, service],
            lastUpdated: new Date().toISOString(),
        }));
    };

    const formatDuration = (isoString: string | null) => {
        if (!isoString) return 'Not set';
        const endTime = new Date(isoString);
        const now = new Date();
        const diff = endTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m remaining`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
            {/* Header */}
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
                            <Settings className="h-3 w-3" />
                            Maintenance Mode
                        </Badge>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Status Overview */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Maintenance Mode Status</CardTitle>
                                    <CardDescription>Control system availability</CardDescription>
                                </div>
                                <Switch
                                    checked={localSettings.enabled}
                                    onCheckedChange={handleMaintenanceToggle}
                                    disabled={saving}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {localSettings.enabled && (
                                    <Alert className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/50">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Maintenance Mode Active</AlertTitle>
                                        <AlertDescription>
                                            The system is currently in maintenance mode. Only administrators can access the application.
                                            {localSettings.plannedEndTime && (
                                                <div className="mt-2">
                                                    Time remaining: {formatDuration(localSettings.plannedEndTime)}
                                                </div>
                                            )}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex items-center gap-4">
                                    <Label>Duration:</Label>
                                    <Select
                                        value={selectedDuration}
                                        onValueChange={setSelectedDuration}
                                        disabled={!localSettings.enabled}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="1h">1 hour</SelectItem>
                                                <SelectItem value="2h">2 hours</SelectItem>
                                                <SelectItem value="4h">4 hours</SelectItem>
                                                <SelectItem value="8h">8 hours</SelectItem>
                                                <SelectItem value="24h">24 hours</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Maintenance Configuration */}
                    <Tabs defaultValue="message" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="message">Message</TabsTrigger>
                            <TabsTrigger value="services">Services</TabsTrigger>
                            <TabsTrigger value="access">Access Control</TabsTrigger>
                        </TabsList>

                        {/* Message Configuration */}
                        <TabsContent value="message" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Maintenance Message</CardTitle>
                                    <CardDescription>
                                        Set the message users will see during maintenance
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Textarea
                                        value={localSettings.message}
                                        onChange={(e) => updateMessage(e.target.value)}
                                        placeholder="Enter maintenance message..."
                                        className="min-h-[100px]"
                                    />
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Last updated: {new Date(localSettings.lastUpdated).toLocaleString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Services Configuration */}
                        <TabsContent value="services" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Affected Services</CardTitle>
                                    <CardDescription>
                                        Select which services are affected by maintenance
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { id: 'api', name: 'API Services', icon: Globe },
                                            { id: 'database', name: 'Database', icon: Settings },
                                            { id: 'auth', name: 'Authentication', icon: Users },
                                            { id: 'notifications', name: 'Notifications', icon: MessageSquare }
                                        ].map(service => (
                                            <div
                                                key={service.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <Switch
                                                    checked={localSettings.affectedServices.includes(service.id)}
                                                    onCheckedChange={() => updateAffectedServices(service.id)}
                                                    id={service.id}
                                                />
                                                <Label htmlFor={service.id} className="flex items-center gap-2">
                                                    <service.icon className="h-4 w-4 text-muted-foreground" />
                                                    {service.name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Access Control */}
                        <TabsContent value="access" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Access Control</CardTitle>
                                    <CardDescription>
                                        Configure who can access the system during maintenance
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <Label>Allow Admin Access</Label>
                                        </div>
                                        <Switch
                                            checked={localSettings.allowAdminAccess}
                                            onCheckedChange={(checked) =>
                                                setLocalSettings(prev => ({
                                                    ...prev,
                                                    allowAdminAccess: checked
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                            <Label>Preview as User</Label>
                                        </div>
                                        <Switch
                                            checked={showMaintenanceAsAdmin}
                                            onCheckedChange={setShowMaintenanceAsAdmin}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Save Changes */}
                    <div className="flex justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setLocalSettings(settings)}
                            disabled={saving}
                        >
                            Reset Changes
                        </Button>
                        <Button
                            onClick={async () => {
                                setSaving(true);
                                // Here you would typically make an API call to save all settings
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                setSaving(false);
                            }}
                            disabled={saving}
                            className="flex items-center gap-2"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                            <Settings className={`h-4 w-4 ${saving ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
