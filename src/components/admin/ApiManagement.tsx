import { ArrowLeft, Activity, Globe, Clock, AlertTriangle, CheckCircle, XCircle, Wifi } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface ApiEndpointStats {
    endpoint: string;
    total: number;
    success: number;
    errors: number;
    successRate: string;
}

interface ApiLog {
    endpoint: string;
    method: string;
    status_code: number;
    response_time_ms: number;
    created_at: string;
    ip_address: string;
}

interface ApiManagementProps {
    onBack: () => void;
    apiData: {
        totalCalls: number;
        todayCalls: number;
        recentLogs: ApiLog[];
        endpoints: ApiEndpointStats[];
        avgResponseTime: number;
        errorRate: string;
        status: string;
    };
    loading: boolean;
    fetchApiAnalytics: () => Promise<void>;
}

export const ApiManagement = ({
    onBack,
    apiData,
    loading,
    fetchApiAnalytics
}: ApiManagementProps) => {
    useEffect(() => {
        fetchApiAnalytics();
    }, [fetchApiAnalytics]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'online':
                return 'text-green-500';
            case 'error':
                return 'text-red-500';
            default:
                return 'text-yellow-500';
        }
    };

    const getMethodColor = (method: string) => {
        switch (method.toUpperCase()) {
            case 'GET':
                return 'bg-blue-100 text-blue-800';
            case 'POST':
                return 'bg-green-100 text-green-800';
            case 'PUT':
                return 'bg-yellow-100 text-yellow-800';
            case 'DELETE':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
            <header className="border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                onClick={onBack}
                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-2">
                            <Globe className="h-3 w-3" />
                            API Management
                        </Badge>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Status Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* API Status */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    API Status
                                </CardTitle>
                                <Wifi className={`h-4 w-4 ${getStatusColor(apiData.status)}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? "..." : apiData.status}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Current system status
                                </p>
                            </CardContent>
                        </Card>

                        {/* Total API Calls */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total API Calls
                                </CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? "..." : apiData.totalCalls.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {loading ? "..." : `${apiData.todayCalls} calls today`}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Average Response Time */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Avg Response Time
                                </CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? "..." : `${apiData.avgResponseTime}ms`}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Last 24 hours
                                </p>
                            </CardContent>
                        </Card>

                        {/* Error Rate */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Error Rate
                                </CardTitle>
                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? "..." : `${apiData.errorRate}%`}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Of total requests
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Endpoint Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Endpoint Performance</CardTitle>
                            <CardDescription>Success rates and usage statistics by endpoint</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Endpoint</TableHead>
                                            <TableHead className="text-right">Total Calls</TableHead>
                                            <TableHead className="text-right">Success Rate</TableHead>
                                            <TableHead className="text-right">Errors</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                                            </TableRow>
                                        ) : (
                                            apiData.endpoints.map((endpoint) => (
                                                <TableRow key={endpoint.endpoint}>
                                                    <TableCell className="font-mono">{endpoint.endpoint}</TableCell>
                                                    <TableCell className="text-right">{endpoint.total.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right">
                                                        <span className={parseFloat(endpoint.successRate) >= 99 ? 'text-green-500' : 'text-yellow-500'}>
                                                            {endpoint.successRate}%
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right text-red-500">
                                                        {endpoint.errors}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent API Activity</CardTitle>
                            <CardDescription>Latest API calls and their status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Endpoint</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Response Time</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                                            </TableRow>
                                        ) : (
                                            apiData.recentLogs.map((log, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{new Date(log.created_at).toLocaleTimeString()}</TableCell>
                                                    <TableCell>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(log.method)}`}>
                                                            {log.method}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm">{log.endpoint}</TableCell>
                                                    <TableCell>
                                                        {log.status_code >= 200 && log.status_code < 300 ? (
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4 text-red-500" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {log.response_time_ms}ms
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Refresh Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={() => fetchApiAnalytics()}
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            {loading ? "Refreshing..." : "Refresh Analytics"}
                            <Activity className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
