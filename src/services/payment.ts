import { supabase } from "@/integrations/supabase/client";

export const createStripeCheckout = async (planType: 'growth' | 'suite' | 'life_balance') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    console.log('Calling Stripe checkout with:', { planType, userId: user.id });

    const { data, error } = await supabase.functions.invoke('create-checkout-stripe', {
        body: { planType },
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

export const createAsaasCheckout = async (planType: 'growth' | 'suite' | 'life_balance', billingInfo: any, billingType: string = 'UNDEFINED') => {
    const { data, error } = await supabase.functions.invoke('create-checkout-asaas', {
        body: { planType, billingInfo, billingType },
    });

    if (error) {
        throw error;
    }

    return data;
};

export const createAbacatePayCheckout = async (
    planType: 'growth' | 'suite' | 'life_balance',
    billingInfo: {
        name: string;
        email: string;
        cpfCnpj: string;
        cellphone?: string;
    },
    paymentMethod: 'PIX' | 'CARD'
) => {
    const { data, error } = await supabase.functions.invoke('create-checkout-abacatepay', {
        body: { planType, billingInfo, paymentMethod },
    });

    if (error) {
        console.error('Abacate Pay checkout error:', error);
        throw error;
    }

    if (!data || !data.url) {
        throw new Error('Invalid response from Abacate Pay checkout');
    }

    return data;
};
