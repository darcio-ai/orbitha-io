import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const syncUserProfile = async (user: User) => {
    const { id, email, user_metadata } = user;
    const full_name = user_metadata?.full_name || user_metadata?.name || null;
    const avatar_url = user_metadata?.avatar_url || null;

    // Prepare the payload
    // We include both id and user_id to ensure compatibility with different schema variations
    const updates = {
        id,
        user_id: id, // Ensure user_id is populated as it appears in the table
        email,
        full_name,
        avatar_url,
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from("profiles")
        .upsert(updates, {
            onConflict: "id",
        });

    if (error) {
        console.error("Error syncing user profile:", error);
        throw error;
    }
};
