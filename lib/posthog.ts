import posthog from 'posthog-js'
import { PostHog } from 'posthog-js'

export const PHG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY

// Only initialize on client side and when key exists
export const posthogClient: PostHog | undefined =
  typeof window !== 'undefined' && PHG_KEY
    ? posthog.init(PHG_KEY, {
        api_host: 'https://app.posthog.com',
        persistence: 'localStorage',
        autocapture: true,
        capture_pageview: true,
        capture_pageleave: true,
        disable_session_recording: false,
      })
    : undefined

// Event names
export const EVENTS = {
  PHONE_NUMBER_SUBMITTED: 'phone_number_submitted',
  NAME_SUBMITTED: 'name_submitted',
  GOAL_SUBMITTED: 'goal_submitted',
  MOTIVATION_SUBMITTED: 'motivation_submitted',
  TIMEZONE_SUBMITTED: 'timezone_submitted',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  STRIPE_CHECKOUT_STARTED: 'stripe_checkout_started',
  SUBSCRIPTION_COMPLETED: 'subscription_completed',
  SUBSCRIPTION_ENDED: 'subscription_ended',
  SUBSCRIPTION_CANCELLATION_SCHEDULED: 'subscription_cancellation_scheduled',
  PAYMENT_FAILED: 'payment_failed',
} as const

// Tracking helper
export function trackEvent(
  event: string,
  properties?: Record<string, any>,
  callback?: () => void
) {
  if (posthogClient) {
    posthogClient.capture(event, properties, { send_instantly: true })
    if (callback) callback()
  }
}

// Identify user
export function identifyUser(
  distinctId: string,
  properties?: Record<string, any>
) {
  if (posthogClient) {
    posthogClient.identify(distinctId, properties)
  }
}