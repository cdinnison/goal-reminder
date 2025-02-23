import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { EVENTS, trackEvent } from "@/lib/posthog";
import { sendSMS } from "@/lib/twilio";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const sig = (await headers()).get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

    // Helper function to get user data from subscription
    const getUserFromSubscription = async (subscription: Stripe.Subscription) => {
      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("stripe_subscription_id", subscription.id)
        .single();
      return user;
    };

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const phoneNumber = session.metadata?.phoneNumber;

        if (!phoneNumber) {
          throw new Error("No phone number in session metadata");
        }

        // Update user subscription status and store subscription ID
        await supabase
          .from("users")
          .update({ 
            subscription_status: "active",
            stripe_subscription_id: session.subscription as string,
            stripe_customer_id: session.customer as string
          })
          .eq("phone_number", phoneNumber);

        // Send success message via Twilio
        const { data: userData } = await supabase
          .from("users")
          .select("name")
          .eq("phone_number", phoneNumber)
          .single();

        await sendSMS(
          `+${phoneNumber}`,
          `You're all set, ${userData?.name}! 🎉 Each day at 7 AM, we'll send your goal reminder. Let's crush it together! 💪`
        );

        // Track subscription completion
        trackEvent(EVENTS.SUBSCRIPTION_COMPLETED, {
          phone_number: phoneNumber,
          customer_id: session.customer as string,
          subscription_id: session.subscription as string
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await getUserFromSubscription(subscription);
        
        if (user) {
          // Update user subscription status
          await supabase
            .from("users")
            .update({ subscription_status: "canceled" })
            .eq("stripe_subscription_id", subscription.id);

          // Send cancellation confirmation
          await sendSMS(
            `+${user.phone_number}`,
            `Your subscription has ended. We hope you achieved your goals! Text START anytime to set new goals and resubscribe.`
          );

          // Track cancellation
          trackEvent(EVENTS.SUBSCRIPTION_ENDED, {
            phone_number: user.phone_number,
            subscription_id: subscription.id,
            reason: "deleted"
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await getUserFromSubscription(subscription);

        if (user && subscription.cancel_at_period_end) {
          // Update user subscription status to canceling
          await supabase
            .from("users")
            .update({ subscription_status: "canceling" })
            .eq("stripe_subscription_id", subscription.id);

          // Track cancellation scheduled
          trackEvent(EVENTS.SUBSCRIPTION_CANCELLATION_SCHEDULED, {
            phone_number: user.phone_number,
            subscription_id: subscription.id,
            cancel_at: subscription.cancel_at
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        const user = await getUserFromSubscription(subscription);

        if (user) {
          // Send payment failure notification
          await sendSMS(
            `+${user.phone_number}`,
            `We couldn't process your payment for Goal Reminder. Please update your payment method to keep receiving daily reminders: ${process.env.NEXT_PUBLIC_BASE_URL}/billing?phone=${user.phone_number}`
          );

          // Track payment failure
          trackEvent(EVENTS.PAYMENT_FAILED, {
            phone_number: user.phone_number,
            subscription_id: subscription.id,
            attempt_count: invoice.attempt_count
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
