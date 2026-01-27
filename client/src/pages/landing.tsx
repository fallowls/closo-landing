import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  PhoneCall,
  Users,
  Zap,
  ChevronRight,
  Globe,
  CheckCircle2,
  Layers,
  Mic,
  Volume2,
  Activity,
  RefreshCw,
  Search,
  Target,
  BarChart3,
  Lock,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  MousePointer2,
  ArrowUpRight,
  Network,
  Clock,
  Sparkles,
  ZapOff,
  Headphones
} from "lucide-react";
import { useLocation, Link } from "wouter";
import closoLogo from "../assets/closo_logo.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";
import { SEO } from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
};

const slideUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export default function Landing() {
  const [showHeader, setShowHeader] = useState(false);
  const [, setLocation] = useLocation();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1e293b] selection:bg-blue-100 font-sans tracking-tight overflow-x-hidden">
      <SEO 
        title="Closo | The phone platform for B2B commerce" 
        description="Engage with your customers profitably on the phone with parallel dialing, AI intelligence, and deep CRM automation."
      />
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(circle_at_50%_50%,#eff6ff_0%,#ffffff_100%)]" />
        <motion.div 
          animate={{ 
            opacity: [0.03, 0.05, 0.03],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" 
        />
      </div>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6 pt-4"
      >
        <nav className={`flex items-center justify-between px-6 py-2 rounded-xl border transition-all duration-500 ${showHeader ? 'bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-sm w-full max-w-[800px]' : 'bg-transparent border-transparent w-full max-w-[1000px]'}`}>
          <div className="flex items-center gap-10">
            <Link href="/"><img src={closoLogo} alt="Closo" className="h-7 w-auto cursor-pointer object-contain" /></Link>
            <div className="hidden lg:flex items-center gap-6">
              {['Parallel Dialer', 'Intelligence', 'Security', 'Pricing'].map(item => (
                <div key={item} className="cursor-pointer group">
                  <span className="text-[12px] font-medium text-slate-500 group-hover:text-[#111] transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://app.thecloso.com" className="text-[12px] font-medium text-slate-500 hover:text-[#111] transition-colors">Log in</a>
            <Button className="bg-[#111] hover:bg-[#000] text-white px-4 h-8 text-[12px] font-medium rounded-lg shadow-sm transition-all active:scale-95" onClick={() => window.location.href='https://app.thecloso.com'}>Get Started</Button>
          </div>
        </nav>
      </motion.div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/50 flex items-center gap-2"
          >
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Next-Gen Sales Intelligence</span>
          </motion.div>

          <motion.h1 
            {...fadeIn}
            className="text-[40px] md:text-[64px] font-bold tracking-tight mb-6 leading-[1.05] text-slate-900"
          >
            The phone platform for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 animate-gradient-x">B2B commerce</span>
          </motion.h1>
          
          <motion.p 
            {...fadeIn}
            transition={{ ...fadeIn.transition, delay: 0.1 }}
            className="text-[16px] text-slate-500 mb-10 max-w-lg leading-relaxed font-normal"
          >
            Turn every phone call into a revenue driver with our AI-powered parallel dialer and deep CRM intelligence.
          </motion.p>
          
          <motion.div 
            {...fadeIn}
            transition={{ ...fadeIn.transition, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 mb-20"
          >
            <Button className="bg-[#111] hover:bg-[#000] text-white px-8 h-12 text-[14px] font-bold rounded-xl shadow-xl transition-all hover:-translate-y-1" onClick={() => window.location.href='https://app.thecloso.com'}>Start for free</Button>
            <Button variant="outline" className="px-8 h-12 text-[14px] font-bold border-slate-200 text-slate-600 bg-white rounded-xl hover:bg-slate-50 transition-all">Book a demo</Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-5xl"
          >
            <div className="relative w-full rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-200/50 bg-white p-2">
              <img 
                src="/src/assets/hero-dashboard-skeleton.png" 
                alt="Closo Dashboard" 
                className="w-full h-auto object-contain rounded-[1.5rem]"
              />
              
              {/* Floating Pulse Elements */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-1/4 right-10 w-4 h-4 rounded-full bg-emerald-400 blur-xl"
              />
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-1/3 left-10 w-6 h-6 rounded-full bg-blue-400 blur-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Parallel Dialer Detail Section (Animated) */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <motion.div 
              {...slideUp}
              className="lg:w-1/2 space-y-8"
            >
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase tracking-widest border border-emerald-100">
                Performance Engine
              </div>
              <h2 className="text-[36px] md:text-[48px] font-bold text-[#111] leading-tight tracking-tight">
                How our Parallel <br /> Dialer works
              </h2>
              <p className="text-[17px] text-slate-500 leading-relaxed max-w-lg">
                Stop waiting for the ring. Closo calls multiple leads at once and only patches you through when a real person answers.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Smart Multi-Line Dialing", desc: "Dials up to 10 lines simultaneously per agent.", icon: Zap },
                  { title: "Human Detection Engine", icon: Users, desc: "Skips voicemails and busy signals in milliseconds." },
                  { title: "Seamless Handover", icon: Headphones, desc: "Instantly connected with full contact context on screen." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className={`p-6 rounded-2xl border transition-all cursor-default ${activeStep === i ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-white border-transparent'}`}
                  >
                    <div className="flex gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${activeStep === i ? 'bg-[#111] text-white' : 'bg-slate-50 text-slate-400'}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-[16px] font-bold text-[#111] mb-1">{item.title}</h4>
                        <p className="text-[13px] text-slate-400 leading-normal">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="lg:w-1/2 w-full relative">
              <div className="aspect-square bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner flex items-center justify-center p-8 overflow-hidden relative">
                {/* Visual Animation of Parallel Dialing */}
                <div className="relative w-full h-full">
                  {/* Central Node */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 rounded-full bg-[#111] text-white flex items-center justify-center shadow-2xl"
                    >
                      <Users className="w-10 h-10" />
                    </motion.div>
                  </div>

                  {/* Orbits & Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.line
                        key={i}
                        x1="50%" y1="50%"
                        x2={`${20 + i * 15}%`} y2={`${10 + (i % 2) * 80}%`}
                        stroke={activeStep === 0 ? "#3b82f6" : "#e2e8f0"}
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ opacity: 0.1 }}
                        animate={{ 
                          opacity: activeStep === 0 ? [0.1, 0.8, 0.1] : 0.1,
                          strokeDashoffset: [0, -20]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </svg>

                  {/* Floating Contact Nodes */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-14 h-14 rounded-2xl border bg-white shadow-xl flex items-center justify-center z-10 transition-all duration-700`}
                      style={{ 
                        left: `${15 + i * 16}%`, 
                        top: `${10 + (i % 2) * 70}%` 
                      }}
                      animate={{ 
                        y: [0, -10, 0],
                        scale: activeStep === 0 ? 1.1 : 1,
                        borderColor: activeStep === 0 ? '#3b82f6' : '#f1f5f9'
                      }}
                      transition={{ duration: 3 + i, repeat: Infinity }}
                    >
                      <PhoneCall className={`w-5 h-5 ${activeStep === 0 ? 'text-blue-500' : 'text-slate-300'}`} />
                      
                      {/* Success Indicator */}
                      {i === 2 && activeStep > 0 && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                  
                  {/* Detailed Transition Card */}
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute bottom-10 left-10 right-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200 shadow-2xl z-30"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Status</span>
                      </div>
                      <div className="text-[14px] font-bold text-[#111]">
                        {activeStep === 0 && "Dialing 5 leads in parallel..."}
                        {activeStep === 1 && "Human detected on Line 3. Connecting..."}
                        {activeStep === 2 && "Connected. Lead info synced to CRM."}
                        {activeStep === 3 && "Automated follow-up scheduled for Line 1, 2, 4, 5."}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Section */}
      <section className="py-24 bg-[#F8FAFC] border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div {...fadeIn} className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-widest mb-8 border border-blue-100">
            Conversion Lift
          </motion.div>
          <h2 className="text-[32px] md:text-[48px] font-bold text-[#111] mb-20 tracking-tight">
            Triple your conversion <br /> without adding headcount
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                stat: "300%", 
                label: "Increase in Calls", 
                desc: "Average lift in outbound call volume per agent per hour.",
                icon: TrendingUp 
              },
              { 
                stat: "4x", 
                label: "Connect Rate", 
                desc: "Human-answering detection ensures you only talk to real buyers.",
                icon: Zap 
              },
              { 
                stat: "0s", 
                label: "Data Entry", 
                desc: "Automated CRM logging means zero manual typing for sales reps.",
                icon: Clock 
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm transition-all group-hover:shadow-xl group-hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 mx-auto"><item.icon className="w-6 h-6 text-blue-600" /></div>
                  <div className="text-[40px] font-bold text-[#111] mb-2">{item.stat}</div>
                  <div className="text-[16px] font-bold text-slate-800 mb-4">{item.label}</div>
                  <p className="text-[14px] text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid Section (Increased Length) */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div className="text-left">
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">The Toolkit</div>
              <h2 className="text-[32px] md:text-[44px] font-bold text-[#111] tracking-tight">Everything for high-volume sales</h2>
            </div>
            <Button variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50">View Documentation <ArrowUpRight className="ml-2 w-4 h-4" /></Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Lead Intelligence", desc: "Advanced lead scoring identifies high-value decision-makers automatically." },
              { icon: ShieldCheck, title: "Data Security", desc: "Bank-level encryption for all sensitive contact and campaign data." },
              { icon: RefreshCw, title: "Real-time Sync", desc: "Bidirectional sync with Salesforce, HubSpot, and 50+ other CRMs." },
              { icon: MessageSquare, title: "Admin Support", desc: "Integrated community chat for real-time support from our specialist team." },
              { icon: BarChart3, title: "Deep Analytics", desc: "Detailed breakdown of agent performance, call quality, and conversion rates." },
              { icon: Lock, title: "Role-based Access", desc: "Secure multi-user permissions for large sales organizations." },
              { icon: Globe, title: "International Dialing", desc: "Compliant global infrastructure for worldwide sales outreach." },
              { icon: Activity, title: "Live Dashboards", desc: "Monitor entire sales floor activity in a single, unified view." },
              { icon: Layers, title: "Campaign Hub", desc: "Organize thousands of leads into manageable, high-converting campaigns." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-slate-200 hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform"><feature.icon className="w-5 h-5 text-blue-600" /></div>
                <h4 className="text-[18px] font-bold text-[#111] mb-3">{feature.title}</h4>
                <p className="text-[14px] text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Experience */}
      <section className="py-32 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-50 text-purple-600 text-[11px] font-black uppercase tracking-widest border border-purple-100">The Workflow</div>
            <h2 className="text-[36px] font-bold text-[#111] leading-tight tracking-tight">Native CRM flows. <br /> No friction.</h2>
            <p className="text-[17px] text-slate-500 leading-relaxed">
              Closo isn't just another tool. It's an extension of your existing workflow, built to feel native to your CRM.
            </p>
            <div className="space-y-4">
              {[
                { title: "Smart Lead Routing", desc: "AI identifies the best time to call each prospect." },
                { title: "Click-to-Call Everywhere", desc: "One-click dialing from any page in your CRM." },
                { title: "Automated Dispositions", desc: "Call outcomes log themselves instantly." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mt-1 flex-shrink-0 border border-slate-100 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all"><CheckCircle2 className="w-5 h-5" /></div>
                  <div>
                    <div className="text-[16px] font-bold text-slate-800">{item.title}</div>
                    <div className="text-[14px] text-slate-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <Network className="w-5 h-5 text-slate-200" />
              </div>
              <div className="space-y-6">
                {[70, 40, 60, 30].map((w, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded-full" style={{ width: `${w}%` }} />
                    <div className="h-2 bg-slate-50 rounded-full" style={{ width: `${w-15}%` }} />
                  </div>
                ))}
                <div className="pt-6 border-t border-slate-50 flex justify-center">
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-[12px] font-bold flex items-center gap-2"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin-slow" /> Syncing data...
                  </motion.div>
                </div>
              </div>
            </div>
            {/* Abstract Background Decor */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl z-0" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl z-0" />
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Globe className="w-12 h-12 text-blue-600 mx-auto mb-10 opacity-20" />
          <h2 className="text-[32px] font-bold text-[#111] mb-6 tracking-tight">Scale globally. Comply locally.</h2>
          <p className="text-[17px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Our infrastructure is built for high-performance international dialing with built-in compliance for TCPA, GDPR, and local regulations.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#0F172A] text-white relative overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] bg-blue-500/10 rounded-full blur-[120px]" 
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-[40px] md:text-[56px] font-bold mb-8 tracking-tight leading-[1.1]">Ready to double your <br /> revenue pipeline?</h2>
          <p className="text-slate-400 text-[18px] mb-12 max-w-lg mx-auto leading-relaxed">Join the hundreds of high-growth sales teams scaling their outbound with Closo.</p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Button className="bg-white text-[#111] hover:bg-slate-100 px-10 h-14 rounded-2xl font-black text-[15px] shadow-2xl transition-all hover:scale-105" onClick={() => window.location.href='https://app.thecloso.com'}>Start for free</Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white px-10 h-14 rounded-2xl font-black text-[15px] hover:bg-slate-800 transition-all">Talk to Sales</Button>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </div>
  );
}