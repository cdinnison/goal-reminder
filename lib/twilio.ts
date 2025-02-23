import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to: string, body: string, mediaUrl?: string) => {
  try {
    const message = await client.messages.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      body,
      ...(mediaUrl && { mediaUrl: [mediaUrl] })
    });
    return message;
  } catch (error) {
    console.error('Twilio error:', error);
    throw error;
  }
};