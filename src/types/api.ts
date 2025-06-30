
export interface ItemInfo {
  item_id: string;
  display_name: string;
  rarity: string;
  currency: string;
  price: string;
  icon: string;
  description: string;
  duration: string;
  last_seen: string;
  type: string;
}

export interface WeatherData {
  weather_id: string;
  weather_name: string;
  icon: string;
  active: boolean;
  end_duration_unix: number;
  duration: number;
  start_duration_unix: number;
}

export interface MarketItem {
  item_id: string;
  display_name: string;
  icon: string;
  quantity: number;
  Date_Start: string;
  Date_End: string;
  start_date_unix: number;
  end_date_unix: number;
}

export interface StockData {
  seed_stock: MarketItem[];
  gear_stock: MarketItem[];
  egg_stock: MarketItem[];
  cosmetic_stock: MarketItem[];
  eventshop_stock: MarketItem[];
  notifications: Array<{
    message: string;
    timestamp: string;
  }>;
  discord_invite: string;
}
