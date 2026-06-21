import { useState, useEffect } from 'react';
import BcpLogoSymbol from '../components/BcpLogoSymbol';

interface TimerBlockProps {
  label: string;
  value: number;
}

function TimerBlock({ label, value }: TimerBlockProps) {
  return (
    <div className="group flex flex-col items-center">
      <div className="relative">
        {/* Glow effect on hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-bcp-red to-bcp-orange rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex flex-col items-center bg-bcp-dark border border-white/10 rounded-2xl p-4 md:p-8 w-24 md:w-40 shadow-2xl">
          <span className="text-4xl md:text-7xl font-bold text-white tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className="mt-4 text-xs md:text-sm uppercase tracking-[0.3em] text-white/40 font-semibold">
        {label}
      </span>
    </div>
  );
}

export default function ComingSoon() {
  // Target date: Sunday, April 5, 2026, 22:00:00 (10 PM)
  const targetDate = new Date('2026-04-05T22:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bcp-dark flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-bcp-red/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-bcp-orange/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6 animate-slide-up">
          <div className="inline-block p-4 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 mb-4">
            <BcpLogoSymbol className="h-20 w-auto" />
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white">
            Launching <span className="bg-gradient-to-r from-bcp-red via-bcp-orange to-bcp-red bg-[length:200%_auto] animate-gradient text-transparent bg-clip-text">Soon</span>
          </h1>
          <p className="font-script text-3xl md:text-5xl text-bcp-orange/80">
            Blood Chain Pakistan
          </p>
        </div>

        {/* Counter Section */}
        <div className="flex gap-4 md:gap-10 flex-wrap justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <TimerBlock label="Days" value={timeLeft.days} />
          <TimerBlock label="Hours" value={timeLeft.hours} />
          <TimerBlock label="Minutes" value={timeLeft.minutes} />
          <TimerBlock label="Seconds" value={timeLeft.seconds} />
        </div>

        {/* Footer Info */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-white/30 text-sm tracking-widest uppercase mb-4">Establishing a Lifeline</p>
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-white/10"></div>
            <div className="w-2 h-2 rounded-full bg-bcp-red animate-ping"></div>
            <div className="h-[1px] w-12 bg-white/10"></div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-slide-up { animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { opacity: 0; animation: fade-in 1.2s ease-out forwards; }
        .animate-gradient { animation: gradient 3s linear infinite; }
      `}} />
    </div>
  );
}
