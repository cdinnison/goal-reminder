import Stripe from "stripe";
import { EVENTS, trackEvent } from "./posthog";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const createCheckoutSession = async (phoneNumber: string, promoCode?: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL environment variable is not set");
    }

    // Track checkout started
    trackEvent(EVENTS.STRIPE_CHECKOUT_STARTED, {
      phone_number: phoneNumber,
      promo_code: promoCode
    });

    // First create a customer
    const customer = await stripe.customers.create({
      metadata: {
        phoneNumber,
      },
    });

    // Then create the checkout session with the customer
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      customer: customer.id,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      metadata: {
        phoneNumber,
        ...(promoCode && { promoCode }),
      },
      ...(promoCode && {
        discounts: [
          {
            coupon: promoCode,
          },
        ],
      }),
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    return session;
  } catch (error) {
    console.error("Stripe error:", error);
    throw error;
  }
};
