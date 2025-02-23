import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="max-w-2xl mx-auto px-4 py-8 w-full">
        <div className="flex justify-center items-center mb-8 relative">
          <Link 
            href="/" 
            className="absolute left-0 inline-flex items-center text-gray-600 gap-1.5 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="text-sm transition-colors duration-200 group-hover:text-gray-900">Back</span>
          </Link>
          <Image 
            src="/logo.svg" 
            alt="Goal Reminder Logo" 
            width={32}
            height={32}
          />
        </div>
        <h1 className="text-2xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose prose-gray prose-sm">
          <p className="text-gray-600 text-sm mb-4">Last updated: February 11, 2025</p>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm mb-3">
              By accessing and using Goal Reminder&apos;s services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">2. Service Description</h2>
            <p className="text-sm mb-3">
              Goal Reminder provides a subscription-based SMS reminder service that sends daily motivational messages to help users achieve their goals. The service includes:
            </p>
            <ul className="text-sm list-disc pl-6 mb-4">
              <li>Daily SMS motivational reminders</li>
              <li>7-day free trial period</li>
              <li>Annual subscription ($19.99/year after trial)</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">3. Subscription and Billing</h2>
            <ul className="text-sm list-disc pl-6 mb-4">
              <li>Your subscription begins with a 7-day free trial</li>
              <li>After the trial, you will be charged $19.99 annually unless cancelled</li>
              <li>You can cancel your subscription at any time via text message</li>
              <li>No refunds are provided for partial subscription periods</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">4. User Responsibilities</h2>
            <p className="text-sm mb-3">You agree to:</p>
            <ul className="text-sm list-disc pl-6 mb-4">
              <li>Provide accurate and current phone number information</li>
              <li>Maintain the security of your subscription</li>
              <li>Accept SMS messages from our service</li>
              <li>Use the service in compliance with applicable laws</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">5. Service Limitations</h2>
            <p className="text-sm mb-3">
              We strive to provide consistent service but cannot guarantee:
            </p>
            <ul className="text-sm list-disc pl-6 mb-4">
              <li>Uninterrupted service availability</li>
              <li>Delivery of every message</li>
              <li>Specific results from using our service</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">6. Cancellation</h2>
            <p className="text-sm mb-3">
              You can cancel your subscription at any time by sending a text message to our service. Upon cancellation, you will maintain access until the end of your current billing period.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">7. Changes to Terms</h2>
            <p className="text-sm mb-3">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via SMS.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">8. Contact</h2>
            <p className="text-sm mb-3">
              For any questions about these Terms of Service, please contact us at <a href="mailto:hello@goalreminder.xyz">hello@goalreminder.xyz</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
} 