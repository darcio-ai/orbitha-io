import { supabase } from "@/integrations/supabase/client";

export const createStripeCheckout = async (priceId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    console.log('Calling Stripe checkout with:', { priceId, userId: user.id });

    const { data, error } = await supabase.functions.invoke('create-checkout-stripe', {
        body: { priceId, userId: user.id },
    });

    if (error) {
        console.error('Stripe checkout error:', error);
        throw error;
    }
    
    console.log('Stripe checkout response:', data);
    
    if (!data || !data.url) {
        throw new Error('Invalid response from Stripe checkout');
    }
    
    return data;
};

export const createAsaasCheckout = async (value: number, billingInfo: { name: string, email: string, cpfCnpj: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase.functions.invoke('create-checkout-asaas', {
        body: { value, userId: user.id, billingInfo },
    });

    if (error) throw error;
    return data;
};
