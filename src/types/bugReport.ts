export interface BugReport {
    id: string;
    user_id: string;
    message: string;
    image_url?: string;
    external_image_url?: string;
    status: 'pending' | 'in_progress' | 'done';
    created_at: string;
    updated_at: string;
}

export interface BugReportFormData {
    message: string;
    image?: File;
    external_image_url?: string;
}
