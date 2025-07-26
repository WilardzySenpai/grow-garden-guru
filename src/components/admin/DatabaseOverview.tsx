import { Activity, Database, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DatabaseOverviewProps {
    onBack: () => void;
    dbStats: {
        totalProfiles: number;
        recentProfiles: number;
        latestProfiles: Array<{
            display_name: string;
            avatar_url: string;
            created_at: string;
        }>;
        tablesCount: number;
        healthStatus: string;
    };
    loading: boolean;
    fetchDatabaseStats: () => void;
}

export const DatabaseOverview = ({ onBack, dbStats, loading, fetchDatabaseStats }: DatabaseOverviewProps) => {
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
                            <Database className="h-3 w-3" />
                            Database Overview
                        </Badge>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Database Overview</h1>
                            <p className="text-muted-foreground">Monitor database performance and statistics</p>
                        </div>
                        <Button onClick={fetchDatabaseStats} disabled={loading}>
                            {loading ? 'Loading...' : 'Refresh Stats'}
                        </Button>
                    </div>

                    {/* Database Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Records</p>
                                        <p className="text-2xl font-bold">{dbStats.totalProfiles || 0}</p>
                                    </div>
                                    <Database className="h-8 w-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Recent (7 days)</p>
                                        <p className="text-2xl font-bold">{dbStats.recentProfiles || 0}</p>
                                    </div>
                                    <Activity className="h-8 w-8 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Tables</p>
                                        <p className="text-2xl font-bold">{dbStats.tablesCount || 0}</p>
                                    </div>
                                    <Server className="h-8 w-8 text-purple-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Health Status</p>
                                        <p className="text-2xl font-bold text-green-500">{dbStats.healthStatus || 'Unknown'}</p>
                                    </div>
                                    <Badge className={`${dbStats.healthStatus === 'Healthy' ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {dbStats.healthStatus || 'Unknown'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Database Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">Loading activity...</div>
                            ) : !dbStats.latestProfiles || dbStats.latestProfiles.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No recent activity</div>
                            ) : (
                                <div className="space-y-4">
                                    {dbStats.latestProfiles.map((profile, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-accent/10">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={profile.avatar_url} />
                                                <AvatarFallback>
                                                    {profile.display_name?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {profile.display_name || 'Unknown User'} joined
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(profile.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <Badge variant="outline">New User</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Database Tables Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Database Schema</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Table Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Records</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">profiles</TableCell>
                                        <TableCell>User Data</TableCell>
                                        <TableCell>{dbStats.totalProfiles || 0}</TableCell>
                                        <TableCell>
                                            <Badge className="bg-green-500">Active</Badge>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
