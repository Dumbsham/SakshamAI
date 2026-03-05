import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Mic, Sparkles, Globe, BookOpen, Briefcase, ChevronDown, Zap, Heart, Users } from 'lucide-react';

// ── Aurora Background ─────────────────────────────────────────
function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="aurora-1" />
      <div className="aurora-2" />
      <div className="aurora-3" />
    </div>
  );
}

// ── Particles ────────────────────────────────────────────────
function Particles({ count = 60 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background: `radial-gradient(circle, #F5C518, #B8860B)`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ── Number Ticker ────────────────────────────────────────────
function NumberTicker({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, value, motionVal]);

  useEffect(() => {
    return spring.on('change', v => setDisplay(Math.floor(v)));
  }, [spring]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

// ── Animated Beam ────────────────────────────────────────────
function AnimatedBeam({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <motion.div
        className="w-px h-40 origin-top"
        style={{ background: 'linear-gradient(to bottom, transparent, #F5C518, transparent)' }}
        animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// ── Click Spark ───────────────────────────────────────────────
function ClickSpark({ children }: { children: React.ReactNode }) {
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setSparks(prev => [...prev, { id, x, y }]);
    setTimeout(() => setSparks(prev => prev.filter(s => s.id !== id)), 700);
  };

  return (
    <div className="relative inline-block" onClick={handleClick}>
      {children}
      {sparks.map(spark => (
        <div key={spark.id} className="absolute pointer-events-none" style={{ left: spark.x, top: spark.y }}>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ background: i % 2 === 0 ? '#F5C518' : '#9333ea' }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i * Math.PI * 2) / 8) * (30 + Math.random() * 20),
                y: Math.sin((i * Math.PI * 2) / 8) * (30 + Math.random() * 20),
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Shimmer Button ────────────────────────────────────────────
function ShimmerButton({ children, className = '', ...props }: any) {
  return (
    <button
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-xl px-8 py-4 font-bold text-white transition-all ${className}`}
      style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea, #6d28d9)' }}
      {...props}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(245,197,24,0.3), transparent)' }}
        animate={{ translateX: ['−100%', '200%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}

// ── Bento Card ────────────────────────────────────────────────
function BentoCard({ icon: Icon, title, desc, gradient, className = '', delay = 0 }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`relative rounded-2xl p-6 overflow-hidden border border-purple-500/20 backdrop-blur-sm ${className}`}
      style={{ background: 'rgba(30, 10, 60, 0.6)' }}
    >
      <div className={`absolute inset-0 opacity-10 ${gradient}`} />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: 'linear-gradient(135deg, #F5C518, #B8860B)' }}>
          <Icon className="w-6 h-6 text-purple-950" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h3>
        <p className="text-purple-200/70 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// ── Main Landing Page ─────────────────────────────────────────
export function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  return (
    <div className="bg-purple-950 min-h-screen overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .aurora-1 {
          position: absolute; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%);
          top: -200px; left: -100px; animation: aurora-move1 15s ease-in-out infinite;
        }
        .aurora-2 {
          position: absolute; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(245,197,24,0.2) 0%, transparent 70%);
          top: 100px; right: -100px; animation: aurora-move2 18s ease-in-out infinite;
        }
        .aurora-3 {
          position: absolute; width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%);
          bottom: 0; left: 30%; animation: aurora-move3 12s ease-in-out infinite;
        }
        @keyframes aurora-move1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(80px, 60px) scale(1.2); }
        }
        @keyframes aurora-move2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-60px, 80px) scale(1.1); }
        }
        @keyframes aurora-move3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -40px) scale(1.15); }
        }
        .gold-text {
          background: linear-gradient(135deg, #F5C518, #FFD700, #B8860B, #F5C518);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gold-shimmer 4s linear infinite;
        }
        @keyframes gold-shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .mic-pulse::before, .mic-pulse::after {
          content: ''; position: absolute; inset: -8px;
          border-radius: 50%; border: 2px solid rgba(245,197,24,0.4);
          animation: mic-ring 2s ease-out infinite;
        }
        .mic-pulse::after { animation-delay: 1s; }
        @keyframes mic-ring {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

<video
  autoPlay
  muted
  loop
  playsInline
  className="absolute inset-0 w-full h-full object-cover opacity-20"
>
  <source src="/hero-video.mp4" type="video/mp4" />
</video>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Aurora />
        <Particles count={50} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 mb-8"
            style={{ background: 'rgba(245,197,24,0.1)' }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">AI for Bharat Hackathon 2025</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-white">अपनी आवाज़ से</span>
            <br />
            <span className="gold-text">करियर खोजो</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-purple-200/80 text-xl sm:text-2xl mb-4 max-w-2xl mx-auto leading-relaxed"
          >
            Padhai kam ho ya zyada — Saksham har Indian mahila ke liye hai
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-purple-300/50 text-base mb-12"
          >
            Hindi • தமிழ் • తెలుగు • मराठी
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <ClickSpark>
              <Link to="/onboarding">
                <ShimmerButton className="text-lg gap-3 shadow-2xl shadow-purple-900/50">
                  <div className="relative mic-pulse w-6 h-6">
                    <Mic className="w-6 h-6" />
                  </div>
                  Abhi Shuru Karo — Free hai
                </ShimmerButton>
              </Link>
            </ClickSpark>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-xl border border-purple-400/30 text-purple-200 font-medium hover:border-yellow-500/50 hover:text-yellow-400 transition-all"
            >
              Demo dekhein →
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-purple-400/50" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} className="relative py-20 border-y border-purple-800/30">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.1), transparent)' }} />

        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 200, suffix: 'M+', label: 'Women can benefit', icon: Users },
              { value: 4, suffix: ' Languages', label: 'Indian languages', icon: Globe },
              { value: 6, suffix: ' Schemes', label: 'Govt schemes', icon: Sparkles },
              { value: 100, suffix: '% Free', label: 'Always free', icon: Heart },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-black mb-2 gold-text">
                  {statsInView && <NumberTicker value={stat.value} suffix={stat.suffix} />}
                </div>
                <p className="text-purple-300/60 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative py-28 px-6">
        <AnimatedBeam className="left-1/2 top-0" />

        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-yellow-400 text-sm font-semibold uppercase tracking-widest"
          >
            Kaise kaam karta hai
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-black text-white mt-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Teen simple steps
          </motion.h2>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #F5C518, transparent)' }} />

          {[
            { step: '01', icon: Mic, title: 'Apni baat bolo', desc: 'Mic dabao aur Hindi, Tamil, Telugu ya Marathi mein bolo — likhne ki zaroorat nahi', color: '#7c3aed' },
            { step: '02', icon: Sparkles, title: 'AI career suggest karta hai', desc: 'Gemini AI tumhara background samjhega aur tumhare liye best career paths suggest karega', color: '#F5C518' },
            { step: '03', icon: Briefcase, title: 'Courses aur jobs milenge', desc: 'Free courses, local jobs, aur government schemes — sab ek jagah', color: '#9333ea' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -8 }}
              className="relative rounded-2xl p-8 border border-purple-700/30 text-center"
              style={{ background: 'rgba(20, 5, 50, 0.7)' }}
            >
              <div className="text-6xl font-black mb-4 opacity-10 absolute top-4 right-6"
                style={{ color: item.color, fontFamily: "'Playfair Display', serif" }}>
                {item.step}
              </div>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: `${item.color}22`, border: `1px solid ${item.color}44` }}>
                <item.icon className="w-8 h-8" style={{ color: item.color }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
              <p className="text-purple-200/60 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BENTO GRID ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-yellow-400 text-sm font-semibold uppercase tracking-widest">Features</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Sab kuch ek jagah
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <BentoCard
              icon={Mic}
              title="Voice First"
              desc="Likhne ki zaroorat nahi — sirf bolo. Hindi, Tamil, Telugu, Marathi mein."
              gradient="bg-gradient-to-br from-purple-600 to-violet-900"
              className="md:col-span-1 md:row-span-2"
              delay={0}
            />
            <BentoCard
              icon={Zap}
              title="AI-Powered Agent"
              desc="LangGraph agent jo tumhare saath baat karta hai aur real tools use karta hai"
              gradient="bg-gradient-to-br from-yellow-600 to-amber-900"
              delay={0.1}
            />
            <BentoCard
              icon={Globe}
              title="4 Bhashaein"
              desc="Hindi • Tamil • Telugu • Marathi — apni bhasha mein guidance"
              gradient="bg-gradient-to-br from-emerald-600 to-teal-900"
              delay={0.2}
            />
            <BentoCard
              icon={Sparkles}
              title="Govt Schemes"
              desc="PMKVY, PM Vishwakarma, MUDRA Loan — sarkar ki madad seedha tumhare liye"
              gradient="bg-gradient-to-br from-pink-600 to-rose-900"
              delay={0.3}
            />
            <BentoCard
              icon={Briefcase}
              title="Smart Job Matching"
              desc="Education level ke hisaab se jobs — Apna App se LinkedIn tak"
              gradient="bg-gradient-to-br from-blue-600 to-indigo-900"
              className="md:col-span-1"
              delay={0.4}
            />
            <BentoCard
              icon={BookOpen}
              title="Free Courses"
              desc="YouTube aur Udemy ke best courses — apni language mein, apni speed se"
              gradient="bg-gradient-to-br from-orange-600 to-red-900"
              delay={0.5}
            />
            <BentoCard
              icon={Heart}
              title="Hamesha Free"
              desc="Koi hidden charge nahi — Saksham har mahila ke liye bilkul free hai"
              gradient="bg-gradient-to-br from-fuchsia-600 to-purple-900"
              className="md:col-span-2"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* ── PARALLAX QUOTE ── */}
      <section className="relative py-32 overflow-hidden">
        <motion.div
          style={{ y: useTransform(useScroll().scrollYProgress, [0, 1], ['-10%', '10%']) }}
          className="absolute inset-0 pointer-events-none"
          style2={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.2) 0%, transparent 70%)' } as any}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-6xl text-yellow-400/30 font-serif mb-4">"</div>
            <p className="text-2xl sm:text-3xl text-white font-light leading-relaxed mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Bharat mein 200 million women ghar pe baith kar kaam kar sakti hain —
              <span className="gold-text font-bold"> bas sahi raasta chahiye.</span>
            </p>
            <p className="text-purple-300/50 text-sm">— Saksham AI Mission</p>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, transparent 60%)' }} />
          <Particles count={25} />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl sm:text-6xl font-black text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Aaj hi apna
              <br />
              <span className="gold-text">safar shuru karo</span>
            </h2>
            <p className="text-purple-200/70 text-lg mb-10">
              Koi account nahi, koi fee nahi — bas apni awaaz aur sapne
            </p>

            <ClickSpark>
              <Link to="/onboarding">
                <ShimmerButton className="text-xl px-12 py-5 shadow-2xl shadow-purple-900/60">
                  <Mic className="w-6 h-6 mr-3" />
                  Shuru Karo — Bilkul Free
                </ShimmerButton>
              </Link>
            </ClickSpark>

            <p className="text-purple-400/40 text-sm mt-6">
              Hindi • தமிழ் • తెలుగు • मराठी mein available
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-purple-800/30 py-8 px-6 text-center">
        <p className="text-purple-400/40 text-sm">
          © 2026 Saksham AI — Built with ❤️ for Indian Women by Saksham & Radhika
        </p>
      </footer>
    </div>
  );
}