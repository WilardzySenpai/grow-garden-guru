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
  Server,
  AlertTriangle,
  Power,
  PowerOff,
  Bug
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
import { Switch } from '@/components/ui/switch';
import { useMaintenanceMode } from '@/hooks/useMaintenanceMode';
import { BugReportManagement } from '@/components/admin/BugReportManagement';

const ADMIN_DISCORD_ID = "939867069070065714";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    settings: maintenanceSettings,
    toggleMaintenance,
    showMaintenanceAsAdmin,
    setShowMaintenanceAsAdmin,
    isAdmin
  } = useMaintenanceMode();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showDatabaseOverview, setShowDatabaseOverview] = useState(false);
  const [showSystemAnalytics, setShowSystemAnalytics] = useState(false);
  const [showApiManagement, setShowApiManagement] = useState(false);
  const [showMarketAnalytics, setShowMarketAnalytics] = useState(false);
  const [showMaintenanceMode, setShowMaintenanceMode] = useState(false);
  const [showBugReports, setShowBugReports] = useState(false);
  const [dbStats, setDbStats] = useState<any>({});
  const [analyticsData, setAnalyticsData] = useState<any>({});
  const [apiData, setApiData] = useState<any>({});
  const [marketData, setMarketData] = useState<any>(null);
  const [marketAnalytics, setMarketAnalytics] = useState({
    totalItems: 0,
    activeItems: 0,
    expiredItems: 0,
    categoryBreakdown: {},
    averageItemLife: '0h',
    topCategories: [],
    timeToExpiration: [],
    stockLevels: {
      low: 0,
      medium: 0,
      high: 0
    }
  });

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

  // Rest of your existing Admin component code here...

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <Link to="/app" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to App
      </Link>

      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Bug Reports Card */}
        <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setShowBugReports(!showBugReports)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Bug Reports
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Your existing admin cards here... */}
      </div>

      {/* Bug Reports Section */}
      {showBugReports && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Bug Report Management</CardTitle>
          </CardHeader>
          <CardContent>
            <BugReportManagement />
          </CardContent>
        </Card>
      )}

      {/* Your existing admin sections here... */}
    </div>
  );
};

export default Admin;
