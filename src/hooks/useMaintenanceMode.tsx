import { useState, useEffect } from 'react';

export interface MaintenanceSettings {
    market: boolean;
    weather: boolean;
    encyclopedia: boolean;
    calculator: boolean;
    system: boolean;
    notifications: boolean;
}

const defaultSettings: MaintenanceSettings = {
    market: false,
    weather: false,
    encyclopedia: false,
    calculator: false,
    system: false,
    notifications: false,
};

export const useMaintenanceMode = () => {
    const [settings, setSettings] = useState<MaintenanceSettings>(defaultSettings);

    // Load settings from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('maintenance-settings');
        if (stored) {
        try {
            setSettings(JSON.parse(stored));
        } catch (error) {
            console.error('Failed to parse maintenance settings:', error);
        }
        }
    }, []);

    const updateSettings = (newSettings: Partial<MaintenanceSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem('maintenance-settings', JSON.stringify(updated));
    };

    const toggleMaintenance = (component: keyof MaintenanceSettings) => {
        updateSettings({ [component]: !settings[component] });
    };

    const isInMaintenance = (component: keyof MaintenanceSettings) => {
        return settings[component];
    };

    return {
        settings,
        updateSettings,
        toggleMaintenance,
        isInMaintenance,
    };
};