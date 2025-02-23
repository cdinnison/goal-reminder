import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { sendSMS } from "@/lib/twilio";
import { EVENTS, trackEvent } from "@/lib/posthog";

export const dynamic = "force-dynamic";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json();

    // Parse and validate phone number
    const parsedNumber = parsePhoneNumberFromString(phoneNumber);
    if (!parsedNumber?.isValid()) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{ 
        phone_number: parsedNumber.number.slice(1),
        subscription_status: 'trial',
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      // Check for Supabase duplicate key error
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Phone number is already registered" },
          { status: 409 }
        );
      }

      // Handle other database errors
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Track successful phone number submission
    trackEvent(EVENTS.PHONE_NUMBER_SUBMITTED, {
      phone_number: parsedNumber.number,
      success: true
    });

    // Send welcome SMS
    await sendSMS(
      parsedNumber.number,
      "Welcome to Goal Reminder! Each day at 7 AM, we'll remind you of your goal. What's your first name?"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
