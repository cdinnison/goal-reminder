<div align="center">
  <div style="background: white; padding: 20px; border-radius: 20px; display: inline-block; margin-bottom: 20px;">
    <img src="public/logo.svg" alt="Goal Reminder Logo" width="100" height="100" />
  </div>
  
  # Goal Reminder
  
  The simple SMS service that sends daily reminders of your goals and motivations.

  <h4 align="center">
    <a href="#features">Features</a> •
    <a href="#why">Why?</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#prerequisites">Setup Guide</a> •
    <a href="#license">License</a>
  </h4>
</div>

## Features

- ⏰ Daily SMS reminders at 7 AM local time
- 📱 Simple onboarding via SMS
- 🤖 OpenAI-powered goal refinement
- 🔒 Privacy-first design
- 🌍 Timezone-aware scheduling
- 💳 Stripe payment integration

## Why?

Goal Reminder is built on proven psychological research:

- 📚 **Consistent Reminders**: Research shows that regular reminders significantly boost goal achievement by maintaining focus and motivation (Journal of Experimental Psychology).

- 🎯 **Intrinsic Motivation**: Daily reconnection with your personal "why" leads to better long-term success than external rewards alone (Motivation and Emotion, 2014).

- 🧠 **Habit Formation**: Regular, timed notifications create neural pathways that make goal-oriented behaviors more automatic over time.

By combining these scientific principles with simple SMS delivery, Goal Reminder helps turn your aspirations into daily priorities.

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [Supabase](https://supabase.com/) – database
- [Twilio](https://www.twilio.com/) – SMS
- [OpenAI](https://openai.com/) – goal refinement
- [Stripe](https://stripe.com/) – payments
- [PostHog](https://posthog.com/) – analytics
- [Tailwind](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) – styling

## Prerequisites

1. Node.js and npm installed
2. [Stripe CLI](https://stripe.com/docs/stripe-cli) installed
3. A Stripe account
4. A Twilio account
5. A Supabase account
6. An OpenAI account
7. A PostHog account

## Environment Setup

1. Copy `.env.example` to `.env.local` and fill in all required values:
   - Supabase credentials
   - Twilio credentials
   - Stripe credentials
   - OpenAI API key
   - PostHog credentials

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The app will be available at http://localhost:3000

### Stripe Setup

1. Login to Stripe CLI:
   ```bash
   stripe login
   ```

2. Start Stripe webhook listener:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```

3. Copy the webhook signing secret to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxx...
   ```

### Twilio Webhook Setup

1. Install [ngrok](https://ngrok.com/download)

2. Start ngrok:
   ```bash
   ngrok http 3000
   ```

3. In your Twilio console:
   - Go to Phone Numbers > Manage > Active Numbers
   - Select your number
   - Under "Messaging", set webhook URL to: `[your-ngrok-url]/api/webhook/twilio`

## Important Notes

- Ensure Stripe webhook listener is running during development
- The app requires all environment variables to be properly set
- For production, set up Stripe webhook endpoints in the Stripe dashboard
- Set up your Supabase database schema according to `supabase/migrations/0001_initial_schema.sql`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
