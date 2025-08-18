import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { ItemInfo } from '@/types/api';

interface ItemContextMenuProps {
    item: ItemInfo;
    isOpen: boolean;
    position: { x: number; y: number };
    onClose: () => void;
    onViewItem: (item: ItemInfo) => void;
}

export const ItemContextMenu = ({ item, isOpen, position, onClose, onViewItem }: ItemContextMenuProps) => {
    useEffect(() => {
        if (isOpen) {
            const handleClickOutside = () => onClose();
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
            };
            
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
            
            return () => {
                document.removeEventListener('click', handleClickOutside);
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isOpen, onClose]);

    const copyItemLink = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = `${window.location.origin}/encyclopedia/#items/${item.type}/${item.item_id}`;
        try {
            await navigator.clipboard.writeText(url);
            toast({
                title: "Link Copied",
                description: `Link for ${item.display_name} copied to clipboard`,
            });
            onClose();
        } catch (err) {
            toast({
                title: "Copy Failed",
                description: "Failed to copy link to clipboard",
                variant: "destructive"
            });
        }
    };

    const handleViewItem = (e: React.MouseEvent) => {
        e.stopPropagation();
        onViewItem(item);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed z-50 bg-background border border-border rounded-md shadow-lg py-1 min-w-[160px]"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 h-auto text-left rounded-none hover:bg-accent"
                onClick={copyItemLink}
            >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
            </Button>
            <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 h-auto text-left rounded-none hover:bg-accent"
                onClick={handleViewItem}
            >
                <Eye className="w-4 h-4 mr-2" />
                View Item
            </Button>
        </div>
    );
};