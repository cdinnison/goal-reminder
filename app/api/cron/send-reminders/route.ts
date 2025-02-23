import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendSMS } from "@/lib/twilio";
import { DateTime } from "luxon";
import { isValidTimezone } from "@/lib/timezone";
import { generateMorningReminder } from "@/lib/openai";
import { createCheckoutSession } from "@/lib/stripe";

export const dynamic = 'force-dynamic';

interface User {
  phone_number: string;
  name: string;
  goal: string;
  motivation: string;
  time_zone: string;
  subscription_status: 'trial' | 'active';
  created_at: string;
}

export async function GET(request: Request) {
  console.log("🔄 Starting send-reminders cron job");

  try {
    // Query users and log the raw results before filtering
    const { data: users, error } = await supabase
      .from("users")
      .select()
      .in("subscription_status", ["trial", "active"]);

    console.log(
      `📊 Raw users query result: ${JSON.stringify({
        count: users?.length,
        error,
      })}`
    );

    if (error) {
      console.error("❌ Database error:", error);
      throw error;
    }

    // Log filtered users
    const eligibleUsers = users.filter(
      (user: User) =>
        user.goal &&
        user.motivation &&
        user.time_zone &&
        isValidTimezone(user.time_zone)
    );

    console.log(
      `📊 Eligible users: ${eligibleUsers.length} out of ${users.length} total users`
    );

    const now = DateTime.now();
    console.log(`⏰ Current UTC time: ${now.toISO()}`);

    const promises = eligibleUsers.map(async (user: User) => {
      try {
        const userTime = now.setZone(user.time_zone);
        console.log(
          `👤 Processing user ${
            user.phone_number
          } - Local time: ${userTime.toFormat("HH:mm")} (${user.time_zone})`
        );

        // Calculate days since signup
        const signupDate = DateTime.fromISO(user.created_at);
        const daysSinceSignup = Math.floor(userTime.diff(signupDate, "days").days);

        // Send daily reminder at 7 AM local time
        if (userTime.hour === 7 && userTime.minute < 15) {
          // Check if user is either active or within trial period (first 7 days)
          if (user.subscription_status === 'active' || 
              (user.subscription_status === 'trial' && daysSinceSignup <= 7)) {
            console.log(`📱 Attempting to send morning reminder to ${user.phone_number} at ${userTime.toFormat("HH:mm")} ${user.time_zone}`);
            try {
              const reminderMessage = await generateMorningReminder(
                user.name,
                user.goal,
                user.motivation
              );
              await sendSMS(
                `+1${user.phone_number}`,
                reminderMessage
              );
              console.log(`✅ Successfully sent morning reminder to ${user.phone_number}`);
            } catch (error) {
              console.error(`❌ Failed to send morning reminder to ${user.phone_number}:`, error);
              throw error;
            }
          } else {
            console.log(`⏭️ Skipping reminder for ${user.phone_number} - trial expired or inactive subscription`);
          }
        }

        // Send Stripe promotion on day 5 at 12 PM
        if (daysSinceSignup === 4 && userTime.hour === 12 && userTime.minute < 15 && user.subscription_status === 'trial') {
          console.log(`📱 Attempting to send Stripe promotion to ${user.phone_number}`);
          try {
            const session = await createCheckoutSession(user.phone_number);
            await sendSMS(
              `+1${user.phone_number}`,
              `Feeling motivated to reach your goal? For just 5 cents per day, you can keep these texts coming for the next year. Sign up here: ${session.url}`
            );
            console.log(`✅ Successfully sent Stripe promotion to ${user.phone_number}`);
          } catch (error) {
            console.error(`❌ Failed to send Stripe promotion to ${user.phone_number}:`, error);
            throw error;
          }
        }

        // Send trial ending reminder if trial ends tomorrow
        if (daysSinceSignup === 6 && userTime.hour === 12 && userTime.minute < 15 && user.subscription_status === 'trial') {
          console.log(`📱 Attempting to send trial ending reminder to ${user.phone_number}`);
          try {
            const session = await createCheckoutSession(user.phone_number);
            await sendSMS(
              `+1${user.phone_number}`,
              `Hi ${user.name}! Your 7-day trial ends tomorrow. We hope these daily reminders have helped you stay focused on your goal! To continue receiving reminders, join here: ${session.url}`
            );
            console.log(`✅ Successfully sent trial ending reminder to ${user.phone_number}`);
          } catch (error) {
            console.error(`❌ Failed to send trial ending reminder to ${user.phone_number}:`, error);
            throw error;
          }
        }

        // Send trial ended message on day 7 at 12 PM
        if (daysSinceSignup === 7 && userTime.hour === 12 && userTime.minute < 15 && user.subscription_status === 'trial') {
          console.log(`📱 Attempting to send trial ended message to ${user.phone_number}`);
          try {
            const session = await createCheckoutSession(user.phone_number);
            await sendSMS(
              `+1${user.phone_number}`,
              `Hi ${user.name}! We've enjoyed helping you reach your goal this week. To continue receiving your personalized daily reminders: ${session.url}`
            );
            console.log(`✅ Successfully sent trial ended message to ${user.phone_number}`);
          } catch (error) {
            console.error(`❌ Failed to send trial ended message to ${user.phone_number}:`, error);
            throw error;
          }
        }

        // Send 50% off promo code 3 days after trial ends (day 10) if still in trial status
        if (daysSinceSignup === 10 && userTime.hour === 12 && userTime.minute < 15 && user.subscription_status === 'trial') {
          console.log(`📱 Attempting to send promo code to ${user.phone_number}`);
          try {
            const session = await createCheckoutSession(user.phone_number, "GOALGETTER50");
            await sendSMS(
              `+1${user.phone_number}`,
              `Hey ${user.name}! Ready to continue your journey? Your personalized reminders are available for less than the price of a coffee per month. Keep going strong here: ${session.url}`
            );
            console.log(`✅ Successfully sent promo code to ${user.phone_number}`);
          } catch (error) {
            console.error(`❌ Failed to send promo code to ${user.phone_number}:`, error);
            throw error;
          }
        }
      } catch (e) {
        console.error(
          `❌ Error processing timezone ${user.time_zone} for user ${user.phone_number}:`,
          e
        );
      }
    });

    await Promise.all(promises);
    console.log("✅ Cron job completed successfully");
    return NextResponse.json({
      success: true,
      usersProcessed: users?.length ?? 0,
      eligibleUsers: eligibleUsers.length,
    });
  } catch (error: unknown) {
    console.error("❌ Error in send-reminders:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to send reminders", details: errorMessage },
      { status: 500 }
    );
  }
}
