import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BugReportFormData } from '@/types/bugReport';
import { toast } from 'sonner';

export default function BugReport() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<BugReportFormData>({
        message: '',
        external_image_url: '',
    });

    // Redirect if not logged in or is guest
    if (!user || ('isGuest' in user && user.isGuest)) {
        navigate('/auth');
        return null;
    }

    const handleImageUpload = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${Math.random()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
            .from('bug-reports')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('bug-reports')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let image_url: string | undefined;

            if (formData.image) {
                image_url = await handleImageUpload(formData.image);
            }

            const { error } = await supabase
                .from('bug_reports')
                .insert({
                    user_id: user.id,
                    message: formData.message,
                    image_url,
                    external_image_url: formData.external_image_url || null,
                });

            if (error) throw error;

            toast.success('Bug report submitted successfully');
            setFormData({ message: '', external_image_url: '' });
        } catch (error) {
            console.error('Error submitting bug report:', error);
            toast.error('Failed to submit bug report');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Submit a Bug Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="message">Description</Label>
                            <Textarea
                                id="message"
                                placeholder="Please describe the issue you encountered..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Screenshot (Optional)</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setFormData({ ...formData, image: file });
                                    }
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="external_image_url">Image URL (Optional)</Label>
                            <Input
                                id="external_image_url"
                                type="url"
                                placeholder="https://example.com/image.png"
                                value={formData.external_image_url}
                                onChange={(e) => setFormData({ ...formData, external_image_url: e.target.value })}
                            />
                        </div>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
