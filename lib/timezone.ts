import { IANAZone } from "luxon";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Common timezone aliases for fast-path matching
const TIMEZONE_ALIASES: Record<string, string> = {
  "eastern time": "America/New_York",
  et: "America/New_York",
  est: "America/New_York",
  edt: "America/New_York",
  "central time": "America/Chicago",
  ct: "America/Chicago",
  cst: "America/Chicago",
  cdt: "America/Chicago",
  "mountain time": "America/Denver",
  mt: "America/Denver",
  mst: "America/Denver",
  mdt: "America/Denver",
  "pacific time": "America/Los_Angeles",
  pt: "America/Los_Angeles",
  pst: "America/Los_Angeles",
  pdt: "America/Los_Angeles",
};

export async function standardizeTimezone(
  input: string
): Promise<string | null> {
  // Clean and normalize input
  const normalizedInput = input.toLowerCase().trim();

  // Fast path: Check if it's a common alias
  if (TIMEZONE_ALIASES[normalizedInput]) {
    return TIMEZONE_ALIASES[normalizedInput];
  }

  // Fast path: Check if it's already a valid IANA timezone
  if (IANAZone.isValidZone(input)) {
    return input;
  }

  // Use OpenAI to interpret the timezone
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a timezone expert. Given a user's input about their timezone or location, respond ONLY with the correct IANA timezone identifier (e.g., 'America/New_York'). If you cannot determine the timezone with high confidence, respond with 'UNKNOWN'.",
        },
        {
          role: "user",
          content: input,
        },
      ],
      temperature: 0,
      max_tokens: 20,
    });

    const suggestedZone = completion.choices[0].message.content?.trim();

    if (
      suggestedZone &&
      suggestedZone !== "UNKNOWN" &&
      IANAZone.isValidZone(suggestedZone)
    ) {
      return suggestedZone;
    }
  } catch (error) {
    console.error("OpenAI timezone recognition error:", error);
  }

  return null;
}

export function isValidTimezone(timezone: string): boolean {
  return IANAZone.isValidZone(timezone);
}

export function suggestTimezones(input: string): string[] {
  const normalized = input.toLowerCase().trim();

  // Return matching aliases and IANA zones
  return Object.entries(TIMEZONE_ALIASES)
    .filter(([alias]) => alias.includes(normalized))
    .map(([_, zone]) => zone);
}
