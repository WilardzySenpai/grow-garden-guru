import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database.types';

type WeatherStatus = Database['public']['Tables']['weather_status']['Row'];

export const useWeatherData = () => {
    const [weatherData, setWeatherData] = useState<WeatherStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            // No need to set loading to true on refetch, to avoid UI flicker
            // setLoading(true);

            const { data, error } = await supabase
                .from('weather_status')
                .select('*')
                .eq('active', true)
                .order('start_duration_unix', { ascending: false });

            if (error) {
                setError(error.message);
                setWeatherData([]); // Clear data on error
            } else {
                setWeatherData(data || []);
            }
            setLoading(false);
        };

        fetchWeatherData();

        const channel = supabase
            .channel('weather-status-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'weather_status' },
                () => {
                    // No need to set loading to true here, to avoid UI flicker
                    fetchWeatherData(); // Refetch all data on change
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { weatherData, loading, error };
};
