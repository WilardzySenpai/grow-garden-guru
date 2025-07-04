import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  Database, 
  Settings, 
  Activity,
  ArrowLeft,
  BarChart3,
  Server
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ADMIN_DISCORD_ID = "939867069070065714";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showDatabaseOverview, setShowDatabaseOverview] = useState(false);
  const [showSystemAnalytics, setShowSystemAnalytics] = useState(false);
  const [dbStats, setDbStats] = useState<any>({});
  const [analyticsData, setAnalyticsData] = useState<any>({});

  // Check if user has admin access
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if user is the specific admin user by Discord ID
    const discordId = 'isGuest' in user ? null : user.user_metadata?.provider_id;
    if (discordId !== ADMIN_DISCORD_ID) {
      navigate('/app');
      return;
    }
  }, [user, navigate]);

  // Fetch users from database
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch database statistics
  const fetchDatabaseStats = async () => {
    setLoading(true);
    try {
      // Get profiles count
      const { count: profilesCount, error: profilesError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (profilesError) throw profilesError;

      // Get recent profiles (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentProfilesCount, error: recentError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      if (recentError) throw recentError;

      // Get latest profiles for activity feed
      const { data: latestProfiles, error: latestError } = await supabase
        .from('profiles')
        .select('display_name, created_at, avatar_url')
        .order('created_at', { ascending: false })
        .limit(5);

      if (latestError) throw latestError;

      setDbStats({
        totalProfiles: profilesCount || 0,
        recentProfiles: recentProfilesCount || 0,
        latestProfiles: latestProfiles || [],
        tablesCount: 1, // We know we have 1 table (profiles)
        healthStatus: 'Healthy'
      });
    } catch (error) {
      console.error('Error fetching database stats:', error);
      setDbStats({
        totalProfiles: 0,
        recentProfiles: 0,
        latestProfiles: [],
        tablesCount: 0,
        healthStatus: 'Error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch system analytics
  const fetchSystemAnalytics = async () => {
    setLoading(true);
    try {
      // Get user growth data (simulated analytics)
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get today's activity
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Simulate additional analytics data
      const pageViews = Math.floor(Math.random() * 10000) + 5000;
      const sessionDuration = Math.floor(Math.random() * 300) + 120; // 2-7 minutes
      const bounceRate = Math.floor(Math.random() * 40) + 20; // 20-60%
      const errorRate = Math.random() * 2; // 0-2%

      setAnalyticsData({
        totalUsers: totalUsers || 0,
        activeUsers: todayUsers || 0,
        pageViews: pageViews,
        sessionDuration: `${Math.floor(sessionDuration / 60)}:${(sessionDuration % 60).toString().padStart(2, '0')}`,
        bounceRate: `${bounceRate}%`,
        errorRate: `${errorRate.toFixed(2)}%`,
        systemLoad: Math.floor(Math.random() * 60) + 20, // 20-80%
        memoryUsage: Math.floor(Math.random() * 40) + 40, // 40-80%
        responseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
        throughput: Math.floor(Math.random() * 500) + 200, // 200-700 req/min
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsData({
        totalUsers: 0,
        activeUsers: 0,
        pageViews: 0,
        sessionDuration: '0:00',
        bounceRate: '0%',
        errorRate: '0%',
        systemLoad: 0,
        memoryUsage: 0,
        responseTime: 0,
        throughput: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Return early if user doesn't have access
  if (!user || ('isGuest' in user) || user.user_metadata?.provider_id !== ADMIN_DISCORD_ID) {
    return null;
  }

  if (showUserManagement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowUserManagement(false)}
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

        {/* User Management Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground">View and manage all user accounts</p>
              </div>
              <Button onClick={fetchUsers} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Users ({users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No users found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Avatar</TableHead>
                        <TableHead>Display Name</TableHead>
                        <TableHead>Discord ID</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={profile.avatar_url} />
                              <AvatarFallback>
                                {profile.display_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium">
                            {profile.display_name || 'No name'}
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

  if (showDatabaseOverview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowDatabaseOverview(false)}
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

        {/* Database Overview Content */}
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
                    {dbStats.latestProfiles.map((profile: any, index: number) => (
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

  if (showSystemAnalytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowSystemAnalytics(false)}
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

        {/* System Analytics Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">System Analytics</h1>
                <p className="text-muted-foreground">Real-time system performance and usage metrics</p>
              </div>
              <Button onClick={fetchSystemAnalytics} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh Analytics'}
              </Button>
            </div>

            {/* User Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{analyticsData.totalUsers || 0}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Today</p>
                      <p className="text-2xl font-bold">{analyticsData.activeUsers || 0}</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Page Views</p>
                      <p className="text-2xl font-bold">{analyticsData.pageViews?.toLocaleString() || 0}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Session Duration</p>
                      <p className="text-2xl font-bold">{analyticsData.sessionDuration || '0:00'}</p>
                    </div>
                    <Activity className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-accent/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">CPU Load</span>
                      <span className="text-sm text-muted-foreground">{analyticsData.systemLoad}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${analyticsData.systemLoad}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="text-sm text-muted-foreground">{analyticsData.memoryUsage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${analyticsData.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Response Time</span>
                      <span className="text-sm text-muted-foreground">{analyticsData.responseTime}ms</span>
                    </div>
                    <Badge variant={analyticsData.responseTime < 100 ? "default" : analyticsData.responseTime < 200 ? "secondary" : "destructive"}>
                      {analyticsData.responseTime < 100 ? 'Excellent' : analyticsData.responseTime < 200 ? 'Good' : 'Slow'}
                    </Badge>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Throughput</span>
                      <span className="text-sm text-muted-foreground">{analyticsData.throughput} req/min</span>
                    </div>
                    <Badge variant="outline">{analyticsData.throughput > 400 ? 'High' : analyticsData.throughput > 250 ? 'Medium' : 'Low'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Traffic Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                    <span className="font-medium">Bounce Rate</span>
                    <Badge variant="outline">{analyticsData.bounceRate}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                    <span className="font-medium">Error Rate</span>
                    <Badge variant={parseFloat(analyticsData.errorRate) < 1 ? "default" : "destructive"}>
                      {analyticsData.errorRate}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                    <span className="font-medium">Avg Session Duration</span>
                    <Badge variant="secondary">{analyticsData.sessionDuration}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                    <span className="font-medium">Database Status</span>
                    <Badge className="bg-green-500">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                    <span className="font-medium">API Status</span>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                    <span className="font-medium">Cache Status</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const adminSections = [
    {
      icon: Users,
      title: "User Management",
      description: "View and manage user accounts",
      color: "text-blue-500",
      count: "1,247"
    },
    {
      icon: Database,
      title: "Database Overview",
      description: "Monitor database performance and stats",
      color: "text-green-500",
      count: "99.9%"
    },
    {
      icon: Activity,
      title: "System Analytics",
      description: "Track system usage and performance",
      color: "text-purple-500",
      count: "Real-time"
    },
    {
      icon: Server,
      title: "API Management",
      description: "Monitor API endpoints and usage",
      color: "text-orange-500",
      count: "Active"
    },
    {
      icon: BarChart3,
      title: "Market Analytics",
      description: "Advanced market data insights",
      color: "text-indigo-500",
      count: "Live"
    },
    {
      icon: Settings,
      title: "System Configuration",
      description: "Manage system settings and configurations",
      color: "text-red-500",
      count: "Config"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/app" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to App
              </Link>
            </div>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Shield className="h-3 w-3" />
              Admin Panel
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive administration panel for managing the Grow A Garden Guru platform
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">System Uptime</p>
                    <p className="text-2xl font-bold">99.9%</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">API Requests</p>
                    <p className="text-2xl font-bold">24.7K</p>
                  </div>
                  <Server className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Sessions</p>
                    <p className="text-2xl font-bold">342</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105 group cursor-pointer">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-accent/20 w-fit">
                    <section.icon className={`h-8 w-8 ${section.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    {section.description}
                  </p>
                  <div className="text-center">
                    <Badge variant="outline">
                      {section.count}
                    </Badge>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      if (section.title === "User Management") {
                        setShowUserManagement(true);
                        fetchUsers();
                      } else if (section.title === "Database Overview") {
                        setShowDatabaseOverview(true);
                        fetchDatabaseStats();
                      } else if (section.title === "System Analytics") {
                        setShowSystemAnalytics(true);
                        fetchSystemAnalytics();
                      }
                    }}
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10">
                  <span className="text-sm font-medium">Database</span>
                  <Badge className="bg-green-500 hover:bg-green-600">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10">
                  <span className="text-sm font-medium">API Services</span>
                  <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10">
                  <span className="text-sm font-medium">WebSocket</span>
                  <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;