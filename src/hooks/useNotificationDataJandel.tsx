import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database.types';

type jandelMessages = Database['public']['Tables']['jandel_messages']['Row'];

export const useNotificationDataJandel = () => {
    const [notifications, setNotifications] = useState<jandelMessages[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('jandel_messages').select('*').order('timestamp', { ascending: false });

            if (error) {
                setError(error.message);
            } else {
                setNotifications(data);
            }
            setLoading(false);
        };

        fetchNotifications();

        const channel = supabase
            .channel('notifications-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'jandel_messages' },
                () => {
                    fetchNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { notifications, loading, error };
};
