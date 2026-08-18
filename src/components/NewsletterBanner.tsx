import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const NewsletterBanner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setSubscribed(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#D85A80', '#F38BA0', '#E5C158'],
    });

    setTimeout(() => {
      setEmail('');
    }, 4000);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#FFEBF2] via-[#FFF3F8] to-[#F5E6F8] py-10 sm:py-12 border-b border-[#F8D5E3]">
      {/* Sparkle doodles */}
      <div className="absolute top-4 left-8 text-[#F4A8C2] text-xl select-none pointer-events-none font-casual">✦</div>
      <div className="absolute bottom-4 left-16 text-[#E8A5BE] text-lg select-none pointer-events-none font-casual">♡</div>
      <div className="absolute top-4 right-10 text-[#D8B4E2] text-xl select-none pointer-events-none font-casual">✧</div>
      <div className="absolute bottom-4 right-14 text-[#F4A8C2] text-2xl select-none pointer-events-none font-casual">✨</div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left Text */}
        <div className="space-y-1">
          <h2 className="font-sans font-extrabold text-base sm:text-lg tracking-[0.16em] text-[#C4436A] uppercase">
            STAY IN THE LOOP
          </h2>
          <p className="text-xs sm:text-sm text-[#7D6370]">
            New drops, exclusive offers &amp; secret discount codes.
          </p>
        </div>

        {/* Right Form matching reference */}
        <div className="w-full sm:w-auto">
          {subscribed ? (
            <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-sm text-emerald-700 text-xs font-bold border border-[#C6F6D5]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You&apos;re on the VIP list! Check your inbox for TINKLE20.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center w-full max-w-md bg-white rounded-full p-1.5 shadow-md border border-[#FAD0E0]">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent px-4 py-2 text-xs sm:text-sm text-[#3D2C35] placeholder-[#B49AA7] focus:outline-none"
              />
              <button
                type="submit"
                className="btn-tinkle font-sans font-bold text-xs tracking-wider uppercase px-6 py-2.5 rounded-full shrink-0 shadow-sm cursor-pointer"
              >
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
