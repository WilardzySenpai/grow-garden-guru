import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContactFormData } from '@/types/contact';
import { toast } from 'sonner';
import { MessageSquare, Bug, Lightbulb, HelpCircle } from 'lucide-react';

export default function Contact() {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ContactFormData>({
        purpose: 'contact',
        message: '',
        external_image_url: '',
    });

    const purposeOptions = [
        { value: 'contact', label: 'Contacting me', icon: MessageSquare },
        { value: 'bug_report', label: 'Bug report', icon: Bug },
        { value: 'suggestion', label: 'Suggestion', icon: Lightbulb },
        { value: 'other', label: 'Other', icon: HelpCircle },
    ];

    const handleImageUpload = async (file: File) => {
        try {
            const fileExt = file.name.split('.').pop();
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const userId = user ? user.id : 'guest';
            const filePath = `${userId}/${timestamp}_${randomString}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('bug-reports')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw new Error('Failed to upload image');
            }

            const { data: { publicUrl } } = supabase.storage
                .from('bug-reports')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let image_url: string | undefined;

            if (formData.image) {
                image_url = await handleImageUpload(formData.image);
            }

            const userId = user ? user.id : `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

            const { error } = await supabase
                .from('contacts')
                .insert({
                    user_id: userId,
                    purpose: formData.purpose,
                    subject: formData.subject || null,
                    message: formData.message,
                    image_url,
                    external_image_url: formData.external_image_url || null,
                    status: 'pending',
                    is_guest: !user
                });

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            const purposeLabel = purposeOptions.find(option => option.value === formData.purpose)?.label;
            toast.success(`${purposeLabel} submitted successfully! Thank you for your message.`);
            
            setFormData({ 
                purpose: 'contact', 
                message: '', 
                external_image_url: '' 
            });
        } catch (error) {
            console.error('Error submitting contact:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit message');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedPurpose = purposeOptions.find(option => option.value === formData.purpose);
    const IconComponent = selectedPurpose?.icon || MessageSquare;

    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <IconComponent className="h-6 w-6" />
                        Contact Us
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="purpose">Purpose</Label>
                            <Select
                                value={formData.purpose}
                                onValueChange={(value: ContactFormData['purpose']) => 
                                    setFormData({ ...formData, purpose: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select purpose" />
                                </SelectTrigger>
                                <SelectContent>
                                    {purposeOptions.map((option) => {
                                        const IconComp = option.icon;
                                        return (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex items-center gap-2">
                                                    <IconComp className="h-4 w-4" />
                                                    {option.label}
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject (Optional)</Label>
                            <Input
                                id="subject"
                                placeholder="Brief description of your message"
                                value={formData.subject || ''}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Please describe your message in detail..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                rows={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Screenshot/Image (Optional)</Label>
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

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? 'Submitting...' : 'Submit Message'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}