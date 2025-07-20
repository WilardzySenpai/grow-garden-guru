export interface PetInfo {
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

export type PetApiResponse = PetInfo[];
