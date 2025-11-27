import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const syncUserProfile = async (user: User) => {
    try {
        const { id, email, user_metadata } = user;
        const full_name = user_metadata?.full_name || user_metadata?.name || null;
        const avatar_url = user_metadata?.avatar_url || null;

        const { error } = await supabase
            .from("profiles")
            .upsert(
                {
                    id,
                    email,
                    full_name,
                    avatar_url,
                    last_login_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: "id",
                }
            );

        if (error) {
            console.error("Error syncing user profile:", error);
        }
    } catch (error) {
        console.error("Unexpected error syncing user profile:", error);
    }
};
