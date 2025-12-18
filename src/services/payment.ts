import { supabase } from "@/integrations/supabase/client";

// Plan prices for validation
const PLAN_PRICES: Record<string, number> = {
    life_balance: 67.00,
    growth: 97.00,
    suite: 147.00,
};

export interface CouponValidationResult {
    valid: boolean;
    error?: string;
    coupon?: {
        id: string;
        code: string;
        description: string;
        discountType: 'percentage' | 'fixed';
        discountValue: number;
    };
    originalAmount?: number;
    discountAmount?: number;
    finalAmount?: number;
}

export const validateCoupon = async (
    code: string,
    planType: 'growth' | 'suite' | 'life_balance'
): Promise<CouponValidationResult> => {
    const planValue = PLAN_PRICES[planType];
    
    const { data, error } = await supabase.functions.invoke('validate-coupon', {
        body: { code, planType, planValue },
    });

    if (error) {
        console.error('Coupon validation error:', error);
        return { valid: false, error: 'Erro ao validar cupom' };
    }

    return data;
};

export const createMercadoPagoCheckout = async (
    planType: 'growth' | 'suite' | 'life_balance',
    billingInfo: {
        name: string;
        email: string;
        cpfCnpj: string;
    },
    couponCode?: string
) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    console.log('Calling Mercado Pago checkout with:', { planType, userId: user.id, couponCode });

    const { data, error } = await supabase.functions.invoke('create-checkout-mercadopago', {
        body: { planType, billingInfo, couponCode },
    });

    if (error) {
        console.error('Mercado Pago checkout error:', error);
        throw error;
    }

    console.log('Mercado Pago checkout response:', data);

    if (!data || !data.init_point) {
        throw new Error('Invalid response from Mercado Pago checkout');
    }

    return data;
};

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
