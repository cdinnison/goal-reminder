import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
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
        <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-gray prose-sm">
          <p className="text-gray-600 text-sm mb-4">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Overview</h2>
            <p className="text-sm mb-3">
              Goal Reminder (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our SMS-based goal reminder service.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Information We Collect</h2>
            <p className="text-sm mb-3">We collect the following information:</p>
            <ul className="text-sm list-disc pl-6 mb-4">
              <li>Phone number (to send you reminder messages)</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">How We Use Your Information</h2>
            <p className="text-sm mb-3">We use your information solely to:</p>
            <ul className="text-sm list-disc pl-6 mb-4">
              <li>Send you daily motivational reminders via SMS</li>
              <li>Process your subscription payments</li>
              <li>Provide customer support</li>
              <li>Maintain and improve our service</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Data Protection</h2>
            <p className="text-sm mb-3">
              We implement appropriate security measures to protect your personal information. Your payment information is processed securely through Stripe and is never stored on our servers.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Data Sharing</h2>
            <p className="text-sm mb-3">
              We do not sell, trade, or rent your personal information to third parties. We only share your information with service providers necessary to provide our service (such as SMS providers and payment processors).
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Your Rights</h2>
            <p className="text-sm mb-3">
              You have the right to:
            </p>
            <ul className="text-sm list-disc pl-6 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of communications</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
            <p className="text-sm mb-3">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@goalreminder.xyz">hello@goalreminder.xyz</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
} 