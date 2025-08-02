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
      setLoading(true);
      const { data, error } = await supabase.from('weather_status').select('*');

      if (error) {
        setError(error.message);
      } else {
        setWeatherData(data);
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
