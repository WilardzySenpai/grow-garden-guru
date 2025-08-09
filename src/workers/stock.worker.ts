// src/workers/stock.worker.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { StockData } from '@/types/api';
import isEqual from 'lodash/isEqual';

const SUPABASE_URL = "https://emufdclxlqzwhlcsvtjt.supabase.co";
const SUPABASE_PUBLISHable_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdWZkY2x4bHF6d2hsY3N2dGp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjExOTEsImV4cCI6MjA2NzAzNzE5MX0.ooFCI3njW3iSrU6fAACUAjnhs6t8UmVeaD45s34ERdg";

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHable_KEY);

let userId: string | null = null;
let jstudioKey: string | null = null;
let alertItemIds = new Set<string>();
let prevMarketData: StockData | null = null;
let fetchInterval: NodeJS.Timeout | null = null;

const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

const fetchUserAlerts = async () => {
    if (!userId) return;
    try {
        const { data, error } = await supabase
            .from('user_stock_alerts')
            .select('item_id')
            .eq('user_id', userId);

        if (error) throw error;

        const baseIds = (data || []).map((item) => item.item_id);
        const expanded = new Set<string>();
        for (const id of baseIds) {
            expanded.add(id);
            if (id.endsWith('_seed')) {
                expanded.add(id.replace(/_seed$/, ''));
            } else {
                expanded.add(`${id}_seed`);
            }
        }
        alertItemIds = expanded;
        self.postMessage({ type: 'alerts_loaded', count: alertItemIds.size });
    } catch (err) {
        console.error("[Worker] Failed to fetch user stock alerts:", err);
        self.postMessage({ type: 'error', message: 'Failed to fetch user stock alerts' });
    }
};

const fetchStockData = async () => {
    try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (jstudioKey) {
            headers['Jstudio-key'] = jstudioKey;
        }

        const response = await fetch('https://api.joshlei.com/v2/growagarden/stock', { headers });
        if (!response.ok) {
            throw new Error(`Failed to fetch stock data: ${response.statusText}`);
        }
        const data = await response.json();

        const transformedData: StockData = {
            seed_stock: Array.isArray(data.seed_stock) ? data.seed_stock : [],
            gear_stock: Array.isArray(data.gear_stock) ? data.gear_stock : [],
            egg_stock: Array.isArray(data.egg_stock) ? data.egg_stock : [],
            cosmetic_stock: Array.isArray(data.cosmetic_stock) ? data.cosmetic_stock : [],
            eventshop_stock: Array.isArray(data.eventshop_stock) ? data.eventshop_stock : [],
            travelingmerchant_stock: (data.travelingmerchant_stock && Array.isArray(data.travelingmerchant_stock.stock)) ? data.travelingmerchant_stock.stock : [],
            notifications: Array.isArray(data.notifications) ? data.notifications : [],
            discord_invite: typeof data.discord_invite === 'string' ? data.discord_invite : ''
        };

        self.postMessage({ type: 'market_data', data: transformedData });

        if (prevMarketData && alertItemIds.size > 0 && userId) {
            const allOldItems = [
                ...prevMarketData.seed_stock,
                ...prevMarketData.gear_stock,
                ...prevMarketData.egg_stock,
            ];
            const oldStockMap = new Map(allOldItems.map(item => [item.item_id, item.quantity]));

            const allNewItems = [
                ...transformedData.seed_stock,
                ...transformedData.gear_stock,
                ...transformedData.egg_stock,
            ];

            for (const newItem of allNewItems) {
                if (alertItemIds.has(newItem.item_id)) {
                    const oldStock = oldStockMap.get(newItem.item_id) || 0;
                    if (newItem.quantity > oldStock) {
                        const isRestock = oldStock === 0;
                        self.postMessage({ type: 'stock_alert', item: newItem, isRestock });

                        // Persist notification to DB from worker
                        supabase.from('notifications').insert({
                            user_id: userId,
                            message: `${newItem.display_name} is back in stock! (Quantity: ${newItem.quantity})`,
                            item_id: newItem.item_id,
                            icon: 'stock_alert',
                        }).then(({ error }) => {
                            if (error) console.error('[Worker] Failed to insert notification:', error);
                        });
                    }
                }
            }
        }

        if (!isEqual(prevMarketData, transformedData)) {
            prevMarketData = transformedData;
        }

    } catch (err) {
        console.error("[Worker] Error fetching stock data:", err);
        self.postMessage({ type: 'error', message: 'Failed to fetch stock data' });
    }
};


self.onmessage = async (event) => {
    if (event.data.type === 'start') {
        userId = event.data.userId;
        jstudioKey = event.data.jstudioKey;

        await fetchUserAlerts();
        await fetchStockData();

        if (fetchInterval) clearInterval(fetchInterval);
        fetchInterval = setInterval(fetchStockData, FETCH_INTERVAL);
    } else if (event.data.type === 'stop') {
        if (fetchInterval) clearInterval(fetchInterval);
        fetchInterval = null;
    } else if (event.data.type === 'fetch') {
        fetchStockData();
    }
};

export {};
