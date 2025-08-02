import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { setUserAsAdmin } from '@/lib/admin';
import { toast } from "sonner";
import { useMaintenanceMode } from '@/hooks/useMaintenanceMode';

export default function AdminSetup() {
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Check if user is admin using your maintenance mode hook
    const { isAdmin } = useMaintenanceMode();

    // Redirect if not an admin
    if (!isAdmin) {
        navigate('/');
        return null;
    }

    const handleSetAdmin = async () => {
        if (!userId) {
            toast.error('Please enter a user ID');
            return;
        }

        setLoading(true);
        try {
            const { error } = await setUserAsAdmin(userId);
            if (error) throw error;
            toast.success('Successfully set user as admin!');
        } catch (error) {
            console.error('Error setting user as admin:', error);
            toast.error('Failed to set user as admin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="mb-4"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Set Admin User</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Enter User ID"
                        />
                        <Button
                            onClick={handleSetAdmin}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Setting admin...' : 'Set as Admin'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
