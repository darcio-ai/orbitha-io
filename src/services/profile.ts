import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const syncUserProfile = async (user: User) => {
    const { id, email, user_metadata } = user;
    const firstname = user_metadata?.firstname || user_metadata?.first_name || '';
    const lastname = user_metadata?.lastname || user_metadata?.last_name || '';
    const phone = user_metadata?.phone || '';
    const whatsapp = user_metadata?.whatsapp || '';

    // Prepare the payload using only columns that exist in profiles table
    const updates = {
        id,
        email,
        firstname,
        lastname,
        phone,
        whatsapp,
    };

    console.log("Syncing profile for user:", id);
    console.log("Payload:", updates);

    const { error } = await supabase
        .from("profiles")
        .upsert(updates, {
            onConflict: "id",
        });

    if (error) {
        console.error("Error syncing user profile:", error);
        throw error;
    }

    // Verify if it was saved
    const { data: savedProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (fetchError) {
        console.error("Error verifying saved profile:", fetchError);
    } else {
        console.log("Profile verified in DB:", savedProfile);
    }
};
