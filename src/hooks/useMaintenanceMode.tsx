import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type MaintenanceSettingsRow = Database['public']['Tables']['maintenance_settings']['Row'];

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
    const { user } = useAuth();
    const [settings, setSettings] = useState<MaintenanceSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    // Function to fetch maintenance settings from Supabase
    const fetchMaintenanceSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('maintenance_settings')
                .select('market, weather, encyclopedia, calculator, system, notifications')
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
            const { error } = await supabase
                .from('maintenance_settings')
                .update({ 
                    ...settings,
                    ...newSettings,
                    updated_by: user.id
                } as MaintenanceSettingsRow)
                .not('id', 'is', null); // Update all records (there should only be one)

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
        await updateSettings({ [component]: !settings[component] });
    };

    const isInMaintenance = (component: keyof MaintenanceSettings) => {
        return settings[component];
    };

    return {
        settings,
        updateSettings,
        toggleMaintenance,
        isInMaintenance,
        loading,
    };
};