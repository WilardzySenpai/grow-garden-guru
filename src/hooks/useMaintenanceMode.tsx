import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type MaintenanceSettingsRow = Database['public']['Tables']['maintenance_settings']['Row'];
const ADMIN_DISCORD_ID = "939867069070065714";

export interface MaintenanceSettings {
    enabled: boolean;
    plannedEndTime: string | null;
    message: string;
    lastUpdated: string;
    affectedServices: string[];
    allowAdminAccess: boolean;
}

const defaultSettings: MaintenanceSettings = {
    enabled: false,
    plannedEndTime: null,
    message: "The system is currently down for maintenance. We'll be back shortly.",
    lastUpdated: new Date().toISOString(),
    affectedServices: ['api', 'database', 'auth', 'notifications'],
    allowAdminAccess: true,
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
                .select('enabled, planned_end_time, message, last_updated, affected_services, allow_admin_access')
                .single();

            if (error) throw error;

            setSettings({
                enabled: data.enabled,
                plannedEndTime: data.planned_end_time,
                message: data.message,
                lastUpdated: data.last_updated,
                affectedServices: data.affected_services,
                allowAdminAccess: data.allow_admin_access,
            });
        } catch (error) {
            console.error('Error fetching maintenance settings:', error);
            // It's safer to return default settings on error
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
        if (!isAdmin) {
            toast.error("You don't have permission to perform this action.");
            return;
        }

        try {
            const { error } = await supabase
                .from('maintenance_settings')
                .update(newSettings)
                .eq('id', 1); // Assuming there's a single row with ID 1

            if (error) throw error;
            toast.success('Maintenance settings updated!');
        } catch (error) {
            console.error('Error updating maintenance settings:', error);
            toast.error('Failed to update settings.');
        }
    };

    return {
        settings,
        loading,
        updateSettings,
        showMaintenanceAsAdmin,
        setShowMaintenanceAsAdmin,
        isAdmin,
    };
};