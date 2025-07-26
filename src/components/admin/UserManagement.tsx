import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Search, RefreshCcw, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface UserProfile {
    id: string;
    display_name: string;
    discord_id: string;
    avatar_url: string;
    created_at: string;
    updated_at: string;
}

interface UserManagementProps {
    onBack: () => void;
    users: UserProfile[];
    loading: boolean;
    fetchUsers: () => void;
}

export const UserManagement = ({ onBack, users, loading, fetchUsers }: UserManagementProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>(users);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user => 
            user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.discord_id?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    // Calculate statistics
    const newUsersThisWeek = users.filter(user => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(user.created_at) > weekAgo;
    }).length;

    const activeUsersToday = users.filter(user => {
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return new Date(user.updated_at) > dayAgo;
    }).length;

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
                            <Users className="h-3 w-3" />
                            User Management
                        </Badge>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                            <p className="text-muted-foreground">View and manage all user accounts</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={fetchUsers} disabled={loading} variant="outline">
                                <RefreshCcw className="h-4 w-4 mr-2" />
                                {loading ? 'Refreshing...' : 'Refresh'}
                            </Button>
                            <Button>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add User
                            </Button>
                        </div>
                    </div>

                    {/* User Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Users</p>
                                        <p className="text-2xl font-bold">{users.length}</p>
                                    </div>
                                    <Users className="h-8 w-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">New This Week</p>
                                        <p className="text-2xl font-bold">{newUsersThisWeek}</p>
                                    </div>
                                    <Badge className="bg-green-500">+{newUsersThisWeek}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Active Today</p>
                                        <p className="text-2xl font-bold">{activeUsersToday}</p>
                                    </div>
                                    <Badge className="bg-blue-500">Online</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* User List */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                                <div className="relative w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search users..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">Loading users...</div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    {searchQuery ? 'No users found matching your search' : 'No users found'}
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Discord ID</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead>Last Active</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((profile) => (
                                            <TableRow key={profile.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={profile.avatar_url} />
                                                            <AvatarFallback>
                                                                {profile.display_name?.charAt(0) || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="font-medium">{profile.display_name || 'No name'}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {profile.discord_id || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(profile.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(profile.updated_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(profile.updated_at) > new Date(Date.now() - 24 * 60 * 60 * 1000) ? (
                                                        <Badge className="bg-green-500">Active</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Inactive</Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
