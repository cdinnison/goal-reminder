import { NextResponse } from "next/server";
import twilio from "twilio";
import { createClient } from "@supabase/supabase-js";
import { reformatText } from "@/lib/openai";
import { createCheckoutSession } from "@/lib/stripe";
import { standardizeTimezone, suggestTimezones } from "@/lib/timezone";
import { sendSMS } from "@/lib/twilio";
import { EVENTS, trackEvent } from "@/lib/posthog";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const SUPPORT_EMAIL = "support@goalreminder.xyz";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

enum OnboardingStep {
  START = "start",
  NAME = "name",
  GOAL = "goal",
  WHY = "why",
  TIMEZONE = "timezone",
  COMPLETE = "complete",
}

function standardizePhoneNumber(phone: string): string {
  console.log("Input phone:", phone);
  // Remove any + prefix first
  const cleaned = phone.startsWith("+") ? phone.slice(1) : phone;
  // Then ensure it starts with the country code
  const standardized = cleaned.startsWith("1") ? cleaned : `1${cleaned}`;
  console.log("Standardized phone:", standardized);
  return standardized;
}

async function getCurrentStep(phoneNumber: string): Promise<OnboardingStep> {
  const standardizedPhone = standardizePhoneNumber(phoneNumber);

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("phone_number", standardizedPhone)
    .single();

  if (!user) return OnboardingStep.START;
  if (!user.name) return OnboardingStep.NAME;
  if (!user.goal) return OnboardingStep.GOAL;
  if (!user.motivation) return OnboardingStep.WHY;
  if (!user.time_zone) return OnboardingStep.TIMEZONE;
  return OnboardingStep.COMPLETE;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const body = (formData.get("Body") as string).trim();
    const from = formData.get("From") as string;
    const standardizedPhone = standardizePhoneNumber(from);

    const currentStep = await getCurrentStep(standardizedPhone);
    const twiml = new twilio.twiml.MessagingResponse();

    if (body.toLowerCase() === "help" || body.toLowerCase() === "support") {
      twiml.message(
        `Need help? You can:\n` +
          `1. Email us at ${SUPPORT_EMAIL}\n` +
          `2. Text START to begin again\n` +
          `3. Text CANCEL to cancel your subscription\n\n` +
          `A support agent will get back to you within 24 hours.`
      );
      return new Response(twiml.toString(), {
        headers: { "Content-Type": "text/xml" },
      });
    }

    if (body.toLowerCase() === "cancel") {
      // Get user's Stripe subscription ID
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("stripe_subscription_id")
        .eq("phone_number", standardizedPhone)
        .single();

      if (userError || !user?.stripe_subscription_id) {
        twiml.message(
          "We couldn't find an active subscription. If you think this is an error, please contact support."
        );
      } else {
        try {
          // Cancel the Stripe subscription
          await stripe.subscriptions.update(user.stripe_subscription_id, {
            cancel_at_period_end: true,
          });

          // Update user status in database
          await supabase
            .from("users")
            .update({ subscription_status: "canceling" })
            .eq("phone_number", standardizedPhone);

          twiml.message(
            "Your subscription has been canceled and will end at the end of your current billing period. We'll miss you! Text START anytime to resubscribe."
          );
        } catch (stripeError) {
          console.error("Stripe cancellation error:", stripeError);
          twiml.message(
            "Sorry, we had trouble canceling your subscription. Please try again or contact support if the problem persists."
          );
        }
      }
    } else {
      switch (currentStep) {
        case OnboardingStep.START:
          if (body.toLowerCase() === "start") {
            console.log("Attempting upsert with phone:", standardizedPhone);
            const { data, error } = await supabase.from("users").upsert({
              phone_number: standardizedPhone,
              created_at: new Date().toISOString(),
            });
            if (error) console.error("Upsert error:", error);
            console.log("Upsert result:", data);
            twiml.message(
              "Welcome to Goal Reminder! Each day at 7 AM, we'll remind you of your most important goal. What's your first name? (so we can personalize this experience)"
            );
          } else {
            twiml.message(
              "To begin your daily goal reminders, text 'START.' Let's get you on track to achieving your goals!"
            );
          }
          break;

        case OnboardingStep.NAME:
          await supabase
            .from("users")
            .update({ name: body })
            .eq("phone_number", standardizedPhone);
          
          // Track name submission
          trackEvent(EVENTS.NAME_SUBMITTED, {
            phone_number: standardizedPhone,
            name: body
          });

          twiml.message(
            `Great to meet you, ${body}! 🎉 What's a goal you'd love to focus on right now? (Feel free to keep it simple!)`
          );
          break;

        case OnboardingStep.GOAL:
          const formattedGoal = await reformatText(body, "goal");
          await supabase
            .from("users")
            .update({ goal: formattedGoal })
            .eq("phone_number", standardizedPhone);

          // Track goal submission
          trackEvent(EVENTS.GOAL_SUBMITTED, {
            phone_number: standardizedPhone,
            goal: formattedGoal
          });

          const { data: userData } = await supabase
            .from("users")
            .select("name")
            .eq("phone_number", standardizedPhone)
            .single();
          twiml.message(
            `That's a powerful goal, ${userData?.name}! We're here to help you stay on track! 🌟\n\nWhat's driving you to achieve this? (Your 'why' can be a personal reason, a dream, or something else inspiring.)`
          );
          break;

        case OnboardingStep.WHY:
          const formattedMotivation = await reformatText(body, "motivation");
          await supabase
            .from("users")
            .update({ motivation: formattedMotivation })
            .eq("phone_number", standardizedPhone);

          // Track motivation submission
          trackEvent(EVENTS.MOTIVATION_SUBMITTED, {
            phone_number: standardizedPhone,
            motivation: formattedMotivation
          });

          const { data: userDataWhy } = await supabase
            .from("users")
            .select("name")
            .eq("phone_number", standardizedPhone)
            .single();
          twiml.message(
            `What a great reason to stay motivated, ${userDataWhy?.name}! This will be your fuel when things get tough. 💪\n\nTo make sure we send reminders at the right time, could you share your timezone? (e.g., Pacific Time or Eastern Time)`
          );
          break;

        case OnboardingStep.TIMEZONE:
          const standardizedTimezone = await standardizeTimezone(body);

          if (!standardizedTimezone) {
            const suggestions = suggestTimezones(body);
            if (suggestions.length > 0) {
              twiml.message(
                `I couldn't quite understand that timezone. Did you mean one of these?\n${suggestions
                  .map((tz) => `- ${tz.split("/")[1].replace("_", " ")}`)
                  .join(
                    "\n"
                  )}\n\nPlease try again with one of these options, or try entering your city name.`
              );
            } else {
              twiml.message(
                "I couldn't recognize that timezone. Please try again with something like 'Pacific Time', 'Eastern Time', or just tell me your city (e.g., 'New York' or 'Los Angeles')."
              );
            }
            break;
          }

          await supabase
            .from("users")
            .update({ time_zone: standardizedTimezone })
            .eq("phone_number", standardizedPhone);

          // Track timezone submission
          trackEvent(EVENTS.TIMEZONE_SUBMITTED, {
            phone_number: standardizedPhone,
            timezone: standardizedTimezone
          });

          // Track onboarding completion
          trackEvent(EVENTS.ONBOARDING_COMPLETED, {
            phone_number: standardizedPhone,
            completed_at: new Date().toISOString()
          });

          const session = await createCheckoutSession(standardizedPhone);

          // Send final onboarding message through TwiML
          twiml.message(
            `Awesome! Your 7-day free trial has started, keep a look out for your first reminder tomorrow at 7 AM. 🎉\n\n` +
            `If you'd like to subscribe now to make sure you don't miss a day, click here: ${session.url}\n\n` +
            `It's just $19.99/year (5 cents a day to reach your goal).\n\n` +
            `Cancel anytime by texting CANCEL.`
          );

          break;

        case OnboardingStep.COMPLETE:
          if (body.toLowerCase() === "cancel") {
            await supabase
              .from("users")
              .update({ subscription_status: "canceled" })
              .eq("phone_number", standardizedPhone);
            twiml.message(
              "We've canceled your subscription. You can always text RESTART to come back!"
            );
          } else if (body.toLowerCase() === "restart") {
            await supabase
              .from("users")
              .update({
                name: null,
                goal: null,
                motivation: null,
                time_zone: null,
                subscription_status: null,
              })
              .eq("phone_number", standardizedPhone);
            twiml.message(
              "Welcome back! Let's set up your goals again. What's your first name?"
            );
          } else {
            twiml.message(
              "All set! 🎯 Your reminders are live. Text CANCEL anytime to stop reminders or RESTART to reset your goals."
            );
          }
          break;

        default:
          twiml.message(
            "I didn't understand that message. Please try again or contact support if you need help."
          );
          break;
      }
    }

    return new Response(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(
      "Sorry, we're having technical difficulties. Please try again in a few minutes."
    );
    return new Response(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }
}
