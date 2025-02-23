"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { normalizePhoneNumber, formatPhoneNumber as formatPhone } from "@/lib/phone-utils";
import { AnimatedList } from "@/components/ui/animated-list";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { TestimonialTicker } from "@/components/ui/testimonial-ticker";
import { MessageSquare } from "lucide-react";
import { CountryCode, parsePhoneNumber } from "libphonenumber-js";
import { TextAnimate } from "@/components/ui/text-animate";

const formatPhoneWithParentheses = (number: string) => {
  try {
    const phoneNumber = parsePhoneNumber(number);
    if (!phoneNumber) return number;

    // For US/CA numbers, use (XXX) XXX-XXXX format
    if (phoneNumber.country === 'US' || phoneNumber.country === 'CA') {
      const formatted = phoneNumber.formatNational();
      return `+1 ${formatted}`;
    }

    // For other countries, use the standard international format
    return phoneNumber.formatInternational();
  } catch {
    return number;
  }
};

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedNumber, setConfirmedNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    setError("");
    
    try {
      const normalizedNumber = normalizePhoneNumber(phoneNumber, countryCode);
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          phoneNumber: normalizedNumber,
          countryCode 
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        
        // Handle specific error cases
        switch (response.status) {
          case 409:
            throw new Error("This phone number is already registered");
          case 400:
            throw new Error(data.message || "Invalid phone number");
          case 429:
            throw new Error("Too many attempts. Please try again later");
          default:
            throw new Error("Failed to sign up. Please try again");
        }
      }
      
      setPhoneNumber("");
      setConfirmedNumber(normalizedNumber);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Add example notifications
  const notifications = [
    {
      id: 1,
      message: "Your future self will thank you for putting in the work today 💫",
      time: "5d ago"
    },
    {
      id: 2,
      message: "Keep pushing! Every rep brings you closer to your dream physique 🏋️‍♀️", 
      time: "4d ago"
    },
    {
      id: 3,
      message: "Time for your daily workout routine 🔥",
      time: "3d ago"
    },
    {
      id: 4,
      message: "You're building healthy habits that will last a lifetime 🌱",
      time: "2d ago"
    },
    {
      id: 5,
      message: "Small steps lead to big changes. Keep showing up! ✨",
      time: "1d ago"
    },
    {
      id: 6,
      message: "Remember your goal: Hit the gym 3x this week 💪",
      time: "Just now"
    }
  ];

  return (
    <main className="min-h-screen bg-white flex flex-col items-center">
      {isSuccess ? (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <TextAnimate
                as="h2"
                className="text-2xl font-bold"
                animation="blurIn"
                by="character"
              >
                Check your messages
              </TextAnimate>
              <TextAnimate
                as="p"
                className="text-muted-foreground"
                animation="blurIn"
                delay={0.3}
                by="character"
                once={true}
              >
                {`We've sent you a text at ${formatPhoneWithParentheses(confirmedNumber)}`}
              </TextAnimate>
            </div>
            
            <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-[3000ms]">
              <figure className="relative mx-auto min-h-fit w-full max-w-[380px]">
                <div className="rounded-2xl bg-[#fff]/95 backdrop-blur-xl shadow-lg p-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-4 h-4">
                      <Image src="/imessage.svg" alt="iMessage icon" width={16} height={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-[11px] font-medium text-[#8E8E8E] tracking-tight">
                          MESSAGES
                        </p>
                        <p className="text-[11px] font-medium text-[#8E8E8E] tracking-tight">
                          Just now
                        </p>
                      </div>
                      <p className="font-semibold text-[15px] leading-tight mt-1">
                        Goal Reminder
                      </p>
                      <p className="text-[14px] leading-tight mt-0.5">
                        Welcome to Goal Reminder! Each day at 7 AM, we&apos;ll remind you of your goal. 🎉
                      </p>
                    </div>
                  </div>
                </div>
              </figure>
            </div>

            <p className="text-sm text-center text-muted-foreground animate-in">
              Didn&apos;t receive a message? <a href="mailto:hello@goalreminder.xyz" className="text-primary cursor-pointer hover:underline">Contact support</a>
            </p>
          </div>
        </div>
      ) : (
        <>
          <TestimonialTicker />
          <div className="pt-6 sm:pt-[7vh] p-4 w-full flex flex-col items-center">
            <div className="max-w-md w-full space-y-8 relative">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Image 
                    src="/logo.svg" 
                    alt="Goal Reminder Logo" 
                    width={32} 
                    height={32}
                    style={{ width: '32px', height: '32px' }}
                    className="text-primary transition-transform hover:scale-110 active:rotate-180 duration-300 hover:cursor-pointer" 
                  />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">
                  Turn goals into habits with daily SMS reminders
                </h1>
                <p className="text-muted-foreground">
                  500+ people use Goal Reminder to reach their goals every day. <Link href="/why-it-works" className="underline">Learn the science behind why it works</Link>.
                </p>
                <div className="flex justify-center space-x-0.5 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <PhoneInput
                  value={phoneNumber}
                  onChange={(value: string, valid: boolean, country: CountryCode) => {
                    setPhoneNumber(value);
                    setIsValid(valid);
                    setCountryCode(country);
                  }}
                  error={error}
                  className="h-12"
                />
                
                <Button 
                  type="submit" 
                  className="w-full h-12" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending you a text..." : "Start your 7-day free trial"}
                </Button>
              </form>

              <div className="space-y-4 text-center text-sm text-muted-foreground flex flex-col items-center">
                <p>No credit card required during trial, then just $19.99/year ($1.67/month). Cancel anytime via text.</p>
                <Image 
                  src="/stripe.svg" 
                  alt="Stripe" 
                  width={120} 
                  height={48}
                  style={{ width: '120px', height: '48px' }}
                />
                <div className="flex justify-center space-x-3 text-xs text-muted-foreground">
                  <Link href="/privacy" className="hover:text-gray-600 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="hover:text-gray-600 transition-colors">
                    Terms of Service
                  </Link>
                </div>
              </div>

              <div className="absolute left-0 right-0 top-full pt-8">
                <div className="relative h-[300px] overflow-hidden">
                  <AnimatedList delay={1000}>
                    {notifications.map((notification, index) => (
                      <figure
                        key={notification.id}
                        className={cn(
                          "relative mx-auto min-h-fit w-full max-w-[380px]",
                          "transform transition-all duration-300 ease-out"
                        )}
                      >
                        <div className="rounded-2xl bg-[#fff]/95 backdrop-blur-xl shadow-lg p-3">
                          <div className="flex items-start space-x-2">
                            <div className="w-4 h-4">
                              <Image src="/imessage.svg" alt="iMessage icon" width={16} height={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <p className="text-[11px] font-medium text-[#8E8E8E] tracking-tight">
                                  MESSAGES
                                </p>
                                <p className="text-[11px] font-medium text-[#8E8E8E] tracking-tight">
                                  {notification.time}
                                </p>
                              </div>
                              <p className="font-semibold text-[15px] leading-tight mt-1">
                                Goal Reminder
                              </p>
                              <p className="text-[14px] leading-tight mt-0.5">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      </figure>
                    ))}
                  </AnimatedList>
                  
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}