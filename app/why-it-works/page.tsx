import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function WhyItWorks() {
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
        <h1 className="text-2xl font-bold mb-6">The Power of Daily Reminders: Why It Works</h1>
        
        <div className="prose prose-gray prose-sm">
          <section className="mb-8">
            <p className="text-gray-600 leading-relaxed mb-6">
              Imagine a simple text popping up on your phone every day: &ldquo;You&apos;re working toward running a marathon to feel unstoppable—keep going!&rdquo; It&apos;s not just a nudge; it&apos;s grounded in science. Research shows that <span className="bg-yellow-200">consistent reminders can significantly boost goal achievement by keeping your focus sharp and your motivation alive</span>. A study from the Journal of Experimental Psychology found that repeated cues enhance memory retention and reinforce intentions, making you more likely to act on your goals (McDaniel & Einstein, 2000). A daily text taps into this by anchoring your goal in your mind, turning a distant dream into a present priority.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              But it&apos;s not just about remembering the goal—it&apos;s about reconnecting with why it matters to you. Psychology tells us that <span className="bg-yellow-200">intrinsic motivation (doing something because it aligns with your values or brings personal fulfillment) is a powerhouse for long-term success</span>. A 2014 study in Motivation and Emotion showed that people who regularly reflect on their internal &ldquo;why&rdquo; sustain effort longer than those driven by external rewards alone (Ryan & Deci). By delivering a daily message that pairs your goal with your personal reason—like improving your health to be there for your kids—you&apos;re fueling that inner fire. The text becomes a mini ritual, rewiring your brain to stay committed.
            </p>

            <p className="text-gray-600 leading-relaxed">
              The beauty of this service lies in its simplicity and consistency. Behavioral science highlights the power of habits: <span className="bg-yellow-200">small, repeated actions build neural pathways that make behaviors automatic over time</span>. A daily text at the same time each day leverages this, creating a cue that prompts reflection and action—like lacing up your shoes or planning your next step. Combined with the emotional boost of your &ldquo;why,&rdquo; it&apos;s a one-two punch that science says works. So, why not let a little daily ping help you become the person you want to be?
            </p>
          </section>
        </div>
      </div>
    </main>
  );
} 