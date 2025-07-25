-- Create bug_reports table
CREATE TABLE bug_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) NOT NULL,
            message TEXT NOT NULL,
                image_url TEXT,
                    external_image_url TEXT,
                        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
                            created_at TIMESTAMPTZ DEFAULT NOW(),
                                updated_at TIMESTAMPTZ DEFAULT NOW()
                                );

                                -- Enable RLS
                                ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;

                                -- Policies
                                CREATE POLICY "Users can view their own bug reports"
                                ON bug_reports FOR SELECT
                                TO authenticated
                                USING (auth.uid() = user_id);

                                CREATE POLICY "Users can create bug reports"
                                ON bug_reports FOR INSERT
                                TO authenticated
                                WITH CHECK (auth.uid() = user_id);

                                CREATE POLICY "Admins can view all bug reports"
                                ON bug_reports FOR SELECT
                                TO authenticated
                                USING (
                                    EXISTS (
                                            SELECT 1 FROM auth.users
                                                    WHERE auth.users.id = auth.uid()
                                                            AND auth.users.role = 'admin'
                                                                )
                                                                );

                                                                CREATE POLICY "Admins can update bug reports"
                                                                ON bug_reports FOR UPDATE
                                                                TO authenticated
                                                                USING (
                                                                    EXISTS (
                                                                            SELECT 1 FROM auth.users
                                                                                    WHERE auth.users.id = auth.uid()
                                                                                            AND auth.users.role = 'admin'
                                                                                                )
                                                                                                );
                                                                                                