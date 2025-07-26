import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BugReport } from '@/types/bugReport';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

import { ArrowLeft } from 'lucide-react';

export function BugReportManagement({ onBack }: { onBack: () => void }) {
    const [reports, setReports] = useState<BugReport[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');

    const fetchReports = async () => {
        let query = supabase
            .from('bug_reports')
            .select('*') as any; // TODO: Remove this type assertion once we've properly typed the schema

        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        if (sortBy === 'newest') {
            query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'oldest') {
            query = query.order('created_at', { ascending: true });
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching bug reports:', error);
            toast.error('Failed to fetch bug reports');
            return;
        }

        setReports(data);
    };

    useEffect(() => {
        fetchReports();
    }, [filter, sortBy]);

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from('bug_reports')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Error updating bug report:', error);
            toast.error('Failed to update status');
            return;
        }

        toast.success('Status updated successfully');
        fetchReports();
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'done':
                return <Check className="h-4 w-4 text-green-500" />;
            case 'in_progress':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-red-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'done':
                return <Badge variant="secondary">Done</Badge>;
            case 'in_progress':
                return <Badge variant="outline">In Progress</Badge>;
            default:
                return <Badge variant="destructive">Pending</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            <Button
                variant="ghost"
                className="mb-4"
                onClick={onBack}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>
            <div className="flex gap-4">
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Reports</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Images</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reports.map((report) => (
                        <TableRow key={report.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(report.status)}
                                    {getStatusBadge(report.status)}
                                </div>
                            </TableCell>
                            <TableCell>{report.message}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    {report.image_url && (
                                        <a
                                            href={report.image_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            View Upload
                                        </a>
                                    )}
                                    {report.external_image_url && (
                                        <a
                                            href={report.external_image_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            View External
                                        </a>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                {new Date(report.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    {report.status !== 'in_progress' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => updateStatus(report.id, 'in_progress')}
                                        >
                                            Mark In Progress
                                        </Button>
                                    )}
                                    {report.status !== 'done' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => updateStatus(report.id, 'done')}
                                        >
                                            Mark Done
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
