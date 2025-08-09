import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const STORAGE_KEY = "notifyWhenActive";

export const NotificationSettings = () => {
    const [notifyWhenActive, setNotifyWhenActive] = useState(false);

    useEffect(() => {
        const storedValue = localStorage.getItem(STORAGE_KEY);
        setNotifyWhenActive(storedValue === "true");
    }, []);

    const handleCheckedChange = (checked: boolean) => {
        setNotifyWhenActive(checked);
        localStorage.setItem(STORAGE_KEY, String(checked));
        toast.success(`Notifications will now ${checked ? 'always be shown' : 'only be shown when the tab is hidden'}.`);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Browser Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="active-notifications" className="text-base">
                            Always show notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Enable this to receive notifications even when the tab is active.
                        </p>
                    </div>
                    <Switch
                        id="active-notifications"
                        checked={notifyWhenActive}
                        onCheckedChange={handleCheckedChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
