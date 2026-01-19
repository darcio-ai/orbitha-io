import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const syncUserProfile = async (user: User) => {
    const { id, email, user_metadata } = user;

    // 1. Fetch existing profile to preserve data
    const { data: existingProfile } = await supabase
        .from("profiles")
        .select("firstname, lastname, phone, whatsapp, cpf_cnpj")
        .eq("id", id)
        .maybeSingle();

    // 2. Prepare updates preserving existing data when new data is not available
    const firstname = user_metadata?.firstname || user_metadata?.first_name || existingProfile?.firstname || '';
    const lastname = user_metadata?.lastname || user_metadata?.last_name || existingProfile?.lastname || '';
    const phone = user_metadata?.phone || existingProfile?.phone || '';
    // IMPORTANT: Preserve existing whatsapp - don't overwrite with empty
    const whatsapp = existingProfile?.whatsapp || user_metadata?.whatsapp || '';

    const updates = {
        id,
        email,
        firstname,
        lastname,
        phone,
        whatsapp,
    };

    console.log("Syncing profile for user:", id);
    console.log("Existing profile:", existingProfile);
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
