import { ArrowLeft, Users, Clock, Activity, LineChart, BarChart2, TrendingUp, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

export interface SystemAnalyticsProps {
    onBack: () => void;
    analyticsData: {
        totalUsers: number;
        activeUsers: number;
        weeklyUsers: number;
        monthlyUsers: number;
        pageViews: number;
        sessionDuration: string;
        userGrowthWeek: number;
        userGrowthMonth: number;
        avgUsersPerDay: number;
        peakHour: number;
    };
    loading: boolean;
    fetchSystemAnalytics: () => Promise<void>;
}

export const SystemAnalytics = ({
    onBack,
    analyticsData,
    loading,
    fetchSystemAnalytics
}: SystemAnalyticsProps) => {
    useEffect(() => {
        fetchSystemAnalytics();
    }, [fetchSystemAnalytics]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
            {/* Header */}
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
                            <Activity className="h-3 w-3" />
                            System Analytics
                        </Badge>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total Users Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Users
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? "..." : analyticsData.totalUsers.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {loading ? "..." : `+${analyticsData.userGrowthMonth} this month`}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Active Users Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Users Today
                                </CardTitle>
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? "..." : analyticsData.activeUsers.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {loading ? "..." : `${Math.round((analyticsData.activeUsers / analyticsData.totalUsers) * 100)}% of total users`}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Session Duration Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Avg. Session Duration
                                </CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? "..." : analyticsData.sessionDuration}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Minutes per session
                                </p>
                            </CardContent>
                        </Card>

                        {/* Page Views Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Page Views Today
                                </CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? "..." : analyticsData.pageViews.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {loading ? "..." : `${Math.round(analyticsData.pageViews / analyticsData.activeUsers)} per active user`}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Analytics Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Growth Metrics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Growth Metrics</CardTitle>
                                <CardDescription>User growth over time periods</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Weekly Growth</p>
                                            <p className="text-2xl font-bold">
                                                {loading ? "..." : `+${analyticsData.userGrowthWeek}`}
                                            </p>
                                        </div>
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Monthly Growth</p>
                                            <p className="text-2xl font-bold">
                                                {loading ? "..." : `+${analyticsData.userGrowthMonth}`}
                                            </p>
                                        </div>
                                        <LineChart className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Daily Average</p>
                                            <p className="text-2xl font-bold">
                                                {loading ? "..." : analyticsData.avgUsersPerDay}
                                            </p>
                                        </div>
                                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* User Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>User Activity</CardTitle>
                                <CardDescription>Active users by time period</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Daily Active Users</p>
                                            <p className="text-sm text-muted-foreground">
                                                {loading ? "..." : analyticsData.activeUsers.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Weekly Active Users</p>
                                            <p className="text-sm text-muted-foreground">
                                                {loading ? "..." : analyticsData.weeklyUsers.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Monthly Active Users</p>
                                            <p className="text-sm text-muted-foreground">
                                                {loading ? "..." : analyticsData.monthlyUsers.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Peak Activity Hour</p>
                                            <p className="text-sm text-muted-foreground">
                                                {loading ? "..." : `${analyticsData.peakHour}:00`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Refresh Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={() => fetchSystemAnalytics()}
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
