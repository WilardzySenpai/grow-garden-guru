import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { ItemInfo } from '@/types/api';

interface FullItemViewProps {
    item: ItemInfo | null;
    isOpen: boolean;
    onClose: () => void;
}

export const FullItemView = ({ item, isOpen, onClose }: FullItemViewProps) => {
    if (!item) return null;

    const copyItemLink = async () => {
        const url = `${window.location.origin}/encyclopedia/#items/${item.type}/${item.item_id}`;
        try {
            await navigator.clipboard.writeText(url);
            toast({
                title: "Link Copied",
                description: "Item link copied to clipboard",
            });
        } catch (err) {
            toast({
                title: "Copy Failed",
                description: "Failed to copy link to clipboard",
                variant: "destructive"
            });
        }
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity?.toLowerCase()) {
            case 'common': return 'bg-gray-500';
            case 'uncommon': return 'bg-green-500';
            case 'rare': return 'bg-blue-500';
            case 'epic': return 'bg-purple-500';
            case 'legendary': return 'bg-orange-500';
            case 'mythical': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        {item.icon && (
                            <img
                                src={item.icon}
                                alt={item.display_name}
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        )}
                        <div>
                            <h2 className="text-2xl font-bold">{item.display_name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{item.type}</Badge>
                                {item.rarity && (
                                    <Badge className={`text-white ${getRarityColor(item.rarity)}`}>
                                        {item.rarity}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Description */}
                    {item.description && (
                        <div>
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-sm text-muted-foreground">Item ID</h4>
                            <p className="font-mono text-sm">{item.item_id}</p>
                        </div>

                        {item.price && (
                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground">Price</h4>
                                <p>{item.price} {item.currency || ''}</p>
                            </div>
                        )}

                        {item.duration && (
                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground">Duration</h4>
                                <p>{item.duration}</p>
                            </div>
                        )}

                        {item.last_seen && (
                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground">Last Seen</h4>
                                <p>{item.last_seen}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                        <Button onClick={copyItemLink} variant="outline" className="flex-1">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                        </Button>
                        <Button 
                            onClick={() => window.open(`/encyclopedia/#items/${item.type}/${item.item_id}`, '_blank')}
                            variant="outline"
                            className="flex-1"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open in New Tab
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};