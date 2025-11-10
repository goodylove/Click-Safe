
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const orb1X = useTransform(smoothX, [-300, 300], [-80, 80]);
  const orb1Y = useTransform(smoothY, [-300, 300], [-80, 80]);
  const orb2X = useTransform(smoothX, [-300, 300], [100, -100]);
  const orb2Y = useTransform(smoothY, [-300, 300], [120, -120]);

  useEffect(() => setIsVisible(true), []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"
      onMouseMove={handleMouseMove}
    >
      {/* ---------- Dynamic Orbs ---------- */}
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/30 to-blue-600/20 rounded-full blur-3xl pointer-events-none"
        style={{ x: orb1X, y: orb1Y, left: '20%', top: '10%' }}
      />
      <motion.div
        className="absolute w-[28rem] h-[28rem] bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl pointer-events-none"
        style={{ x: orb2X, y: orb2Y, right: '15%', bottom: '15%' }}
      />

      {/* ---------- Grain Overlay ---------- */}
      <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* ----- Floating Badge ----- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-3 px-5 py-2 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-cyan-300">AI-Powered Threat Detection</span>
        </motion.div>

        {/* ----- Headline ----- */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight"
        >
          <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Secure Your
          </span>
          <span className="block text-white mt-2">Enterprise</span>
        </motion.h1>

        {/* ----- Sub-copy ----- */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
        >
          Advanced email threat detection powered by AI. Stop phishing, malware, and business email
          compromise <span className="text-cyan-400">before they reach your inbox.</span>
        </motion.p>

        {/* ----- CTA Buttons ----- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl overflow-hidden shadow-xl"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Free Trial
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 border border-slate-600 text-slate-300 font-semibold rounded-xl backdrop-blur-sm hover:bg-white/5 hover:border-cyan-500/50 transition-all duration-300"
          >
            Request Demo
          </motion.button>
        </motion.div>

        {/* ----- Live Stat Badge ----- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-400"
        >
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-slate-900"
              />
            ))}
          </div>
          <span>Used daily by 2000+ developers</span>
        </motion.div>
      </div>

      {/* ----- Scroll Hint ----- */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ArrowDown className="w-6 h-6 text-slate-500" />
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------
   Tailwind custom utilities (add to globals.css)
   ------------------------------------------------- */