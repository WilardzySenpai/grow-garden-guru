import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type MaintenanceSettingsRow = Database['public']['Tables']['maintenance_settings']['Row'];
const ADMIN_DISCORD_ID = "939867069070065714";

export interface MaintenanceSettings {
    market: boolean;
    weather: boolean;
    encyclopedia: boolean;
    calculator: boolean;
    system: boolean;
    notifications: boolean;
    recipes: boolean;
}

const defaultSettings: MaintenanceSettings = {
    market: false,
    weather: false,
    encyclopedia: false,
    calculator: false,
    system: false,
    notifications: false,
    recipes: false,
};

export const useMaintenanceMode = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState<MaintenanceSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [showMaintenanceAsAdmin, setShowMaintenanceAsAdmin] = useState(false);

    const isAdmin = user && 'isGuest' in user ? false : user?.user_metadata?.provider_id === ADMIN_DISCORD_ID;

    // Function to fetch maintenance settings from Supabase
    const fetchMaintenanceSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('maintenance_settings')
                .select('market, weather, encyclopedia, calculator, system, notifications, recipes')
                .single();

            if (error) {
                throw error;
            }

            setSettings(data as MaintenanceSettings);
        } catch (error) {
            console.error('Error fetching maintenance settings:', error);
            setSettings(defaultSettings);
        } finally {
            setLoading(false);
        }
    };

    // Subscribe to changes in maintenance settings
    useEffect(() => {
        fetchMaintenanceSettings();

        // Set up real-time subscription
        const subscription = supabase
            .channel('maintenance_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'maintenance_settings'
                },
                () => {
                    fetchMaintenanceSettings();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const updateSettings = async (newSettings: Partial<MaintenanceSettings>) => {
        if (!user?.id) {
            throw new Error('User must be logged in to update maintenance settings');
        }

        try {
            // There's only one row for settings, so we can update it directly.
            // A 'match' clause is safer than a general update.
            const { data: settingsList, error: fetchError } = await supabase
                .from('maintenance_settings')
                .select('id')
                .limit(1);

            if (fetchError || !settingsList || settingsList.length === 0) {
                throw new Error('Could not fetch maintenance settings to update.');
            }

            const settingsId = settingsList[0].id;

            const { error } = await supabase
                .from('maintenance_settings')
                .update({
                    ...newSettings,
                    updated_by: user.id,
                    updated_at: new Date().toISOString(),
                })
                .match({ id: settingsId });

            if (error) {
                throw error;
            }

            // The subscription will handle updating the local state
        } catch (error) {
            console.error('Error updating maintenance settings:', error);
            throw error;
        }
    };

    const toggleMaintenance = async (component: keyof MaintenanceSettings) => {
        const newSettings = { ...settings, [component]: !settings[component] };
        setSettings(newSettings);
        await updateSettings({ [component]: newSettings[component] });
    };

    const isInMaintenance = (component: keyof MaintenanceSettings) => {
        if (isAdmin && !showMaintenanceAsAdmin) {
            return false;
        }
        return settings[component];
    };

    return {
        settings,
        updateSettings,
        toggleMaintenance,
        isInMaintenance,
        loading,
        showMaintenanceAsAdmin,
        setShowMaintenanceAsAdmin,
        isAdmin,
    };
};