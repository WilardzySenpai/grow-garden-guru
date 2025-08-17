import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Contact } from '@/types/contact';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
    CheckCircle, 
    Clock, 
    Play, 
    XCircle, 
    MessageSquare, 
    Bug, 
    Lightbulb, 
    HelpCircle,
    ExternalLink 
} from 'lucide-react';

export default function ContactManagement() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [purposeFilter, setPurposeFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('created_at_desc');

    const fetchContacts = async () => {
        try {
            let query = supabase.from('contacts').select('*');

            // Apply status filter
            if (filter !== 'all') {
                query = query.eq('status', filter);
            }

            // Apply purpose filter
            if (purposeFilter !== 'all') {
                query = query.eq('purpose', purposeFilter);
            }

            // Apply sorting
            const [field, direction] = sortBy.split('_');
            query = query.order(field, { ascending: direction === 'asc' });

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching contacts:', error);
                return;
            }

            setContacts(data || []);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [filter, purposeFilter, sortBy]);

    const updateStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase
                .from('contacts')
                .update({ status })
                .eq('id', id);

            if (error) {
                console.error('Error updating status:', error);
                toast.error('Failed to update status');
                return;
            }

            toast.success('Status updated successfully');
            fetchContacts();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'in_progress':
                return <Play className="h-4 w-4" />;
            case 'resolved':
                return <CheckCircle className="h-4 w-4" />;
            case 'closed':
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            pending: "outline",
            in_progress: "default",
            resolved: "secondary",
            closed: "destructive"
        };

        return (
            <Badge variant={variants[status] || "outline"} className="flex items-center gap-1">
                {getStatusIcon(status)}
                {status.replace('_', ' ')}
            </Badge>
        );
    };

    const getPurposeIcon = (purpose: string) => {
        switch (purpose) {
            case 'contact':
                return <MessageSquare className="h-4 w-4" />;
            case 'bug_report':
                return <Bug className="h-4 w-4" />;
            case 'suggestion':
                return <Lightbulb className="h-4 w-4" />;
            case 'other':
                return <HelpCircle className="h-4 w-4" />;
            default:
                return <MessageSquare className="h-4 w-4" />;
        }
    };

    const getPurposeBadge = (purpose: string) => {
        const labels: Record<string, string> = {
            contact: 'Contact',
            bug_report: 'Bug Report',
            suggestion: 'Suggestion',
            other: 'Other'
        };

        return (
            <Badge variant="outline" className="flex items-center gap-1">
                {getPurposeIcon(purpose)}
                {labels[purpose] || purpose}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Contact Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Filter by Status</label>
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Filter by Purpose</label>
                            <Select value={purposeFilter} onValueChange={setPurposeFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Purposes</SelectItem>
                                    <SelectItem value="contact">Contact</SelectItem>
                                    <SelectItem value="bug_report">Bug Report</SelectItem>
                                    <SelectItem value="suggestion">Suggestion</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Sort by</label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at_desc">Newest First</SelectItem>
                                    <SelectItem value="created_at_asc">Oldest First</SelectItem>
                                    <SelectItem value="updated_at_desc">Recently Updated</SelectItem>
                                    <SelectItem value="status_asc">Status A-Z</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Purpose</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>Images</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contacts.map((contact) => (
                                    <TableRow key={contact.id}>
                                        <TableCell>
                                            {getPurposeBadge(contact.purpose)}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(contact.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[200px] truncate">
                                                {contact.subject || 'No subject'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[300px] truncate">
                                                {contact.message}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {contact.image_url && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(contact.image_url, '_blank')}
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {contact.external_image_url && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(contact.external_image_url, '_blank')}
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(contact.created_at).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Select
                                                    value={contact.status}
                                                    onValueChange={(value) => updateStatus(contact.id, value)}
                                                >
                                                    <SelectTrigger className="w-[120px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                                        <SelectItem value="resolved">Resolved</SelectItem>
                                                        <SelectItem value="closed">Closed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {contacts.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                No contacts found matching your filters.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}