import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database.types';

type Weather = Database['public']['Tables']['weather']['Row'];

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState<Weather[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const { data, error } = await supabase.from('weather').select('*');
      if (error) {
        setError(error.message);
      } else {
        setWeatherData(data as Weather[]);
      }
    };

    fetchWeatherData();

    const channel = supabase
      .channel('weather-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'weather' },
        (payload) => {
          fetchWeatherData(); // Refetch all data on change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { weatherData, error };
};
