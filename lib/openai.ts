import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const reformatText = async (
  text: string,
  type: "goal" | "motivation"
) => {
  try {
    const prompt =
      type === "goal"
        ? `Reformat this goal to be clear and concise (keep it to just a few words): ${text}`
        : `Reformat this motivation statement to be clear and inspiring, but not cheesy (keep it to just a few words): ${text}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    });

    return (
      response.choices[0].message.content?.trim().replace(/['"]/g, "") || text
    );
  } catch (error) {
    console.error("OpenAI error:", error);
    return text;
  }
};

export const generateMorningReminder = async (
  name: string,
  goal: string,
  motivation: string
) => {
  try {
    const prompt = `Write a quick, friendly morning text as if you're ${name}'s supportive best friend. They're working on: "${goal}" because "${motivation}".

Keep it natural and encouraging - write it like a caring friend would text. Think:
- Warm, friendly tone (like texting a good friend)
- Natural, conversational language
- Can include 1-2 emojis if it feels natural
- Max 2 short sentences
- Should feel supportive but not preachy
- Reference their goal/motivation naturally
- Avoid anything that sounds like a motivational poster

Style guide:
- Write like a caring friend
- Be supportive without being over-the-top
- No corporate/motivational speaker vibes
- Keep it genuine and relatable

Just the message, no quotes.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.9,
    });

    return response.choices[0].message.content?.trim() || `Morning, ${name}! 🌅 Time to work on your goal: ${goal}. Remember your motivation: ${motivation}!`;
  } catch (error) {
    console.error("OpenAI error:", error);
    return `Morning, ${name}! 🌅 Time to work on your goal: ${goal}. Remember your motivation: ${motivation}!`;
  }
};
