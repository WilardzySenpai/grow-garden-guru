import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ItemInfo } from '@/types/api';

interface ItemCardProps {
    item: ItemInfo;
}

export const ItemCard = ({ item }: ItemCardProps) => (
    <Card className="mb-4">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <img
                    src={item.icon}
                    alt={item.display_name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
                {item.display_name}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="font-semibold">ID</p>
                    <p className="font-mono text-xs">{item.item_id}</p>
                </div>
                <div>
                    <p className="font-semibold">Type</p>
                    <Badge variant="outline">{item.type}</Badge>
                </div>
                <div>
                    <p className="font-semibold">Rarity</p>
                    <Badge variant="secondary">{item.rarity}</Badge>
                </div>
                <div>
                    <p className="font-semibold">Price</p>
                    <p>{item.price || 'N/A'}</p>
                </div>
                <div>
                    <p className="font-semibold">Currency</p>
                    <p>{item.currency || 'N/A'}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);
