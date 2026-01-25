import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  RefreshCw
} from "lucide-react";
import { useLocation, Link } from "wouter";
import closoLogo from "../assets/closo_logo.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

export default function Landing() {
  const [showHeader, setShowHeader] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1e293b] selection:bg-blue-100 font-sans tracking-tight overflow-x-hidden">
      <SEO 
        title="Closo | The phone platform for B2B commerce" 
        description="Engage with your customers profitably on the phone with parallel dialing, AI intelligence, and deep CRM automation."
      />
      
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 opacity-[0.6] bg-gradient-to-tr from-blue-50 via-white to-slate-50" />
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
              {['Features', 'Intelligence', 'Pricing'].map(item => (
                <div key={item} className="cursor-pointer group">
                  <span className="text-[12px] font-medium text-slate-500 group-hover:text-[#111] transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://app.thecloso.com" className="text-[12px] font-medium text-slate-500 hover:text-[#111] transition-colors">Log in</a>
            <Button className="bg-[#111] hover:bg-[#000] text-white px-4 h-8 text-[12px] font-medium rounded-lg shadow-sm" onClick={() => window.location.href='https://app.thecloso.com'}>Get Started</Button>
          </div>
        </nav>
      </motion.div>

      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.h1 
            {...fadeIn}
            className="text-[36px] md:text-[52px] font-bold tracking-tight mb-6 leading-[1.1] text-slate-900"
          >
            The phone platform for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">B2B commerce</span>
          </motion.h1>
          
          <motion.p 
            {...fadeIn}
            transition={{ ...fadeIn.transition, delay: 0.1 }}
            className="text-[15px] text-slate-500 mb-10 max-w-md leading-relaxed font-normal"
          >
            Empower your sales team with parallel dialing, real-time AI insights, and seamless CRM synchronization.
          </motion.p>
          
          <motion.div 
            {...fadeIn}
            transition={{ ...fadeIn.transition, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 mb-16"
          >
            <Button className="bg-[#111] hover:bg-[#000] text-white px-6 h-10 text-[13px] font-medium rounded-xl shadow-md" onClick={() => window.location.href='https://app.thecloso.com'}>Start for free</Button>
            <Button variant="outline" className="px-6 h-10 text-[13px] border-slate-200 text-slate-600 bg-white rounded-xl hover:bg-slate-50">Book a demo</Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full"
          >
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-white p-1">
              <img 
                src="/src/assets/hero-dashboard-skeleton.png" 
                alt="Closo Dashboard" 
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white border-y border-slate-50">
        <div className="max-w-4xl mx-auto px-6">
           <div className="text-center mb-12">
             <div className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3">Core Platform</div>
             <h2 className="text-[28px] font-bold text-[#111] tracking-tight">Built for high-growth</h2>
           </div>
           
           <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Power Dialer", icon: PhoneCall, desc: "Scale outbound volume without manual friction." },
                { title: "Voice Agents", icon: Mic, desc: "Automate intake and qualification with human-like AI." },
                { title: "Phone Hub", icon: Layers, desc: "Unified data intelligence synced to your entire stack." }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-xl border border-slate-50 bg-slate-50/30 text-left">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center mb-4 shadow-sm"><item.icon className="w-4 h-4 text-blue-600" /></div>
                  <h3 className="text-[15px] font-bold text-[#111] mb-2">{item.title}</h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-normal">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-4 text-left">
            <div className="text-[9px] font-bold text-purple-600 uppercase tracking-wider">The Experience</div>
            <h2 className="text-[28px] font-bold text-[#111] leading-tight tracking-tight">Unified workflow. <br /> Maximum impact.</h2>
            <p className="text-[14px] text-slate-500 leading-relaxed font-normal">
              Stop switching tabs. Closo brings your entire sales workflow into a single, compact interface that matches your pace.
            </p>
            <ul className="space-y-2">
              {["Smart intent detection", "Instant CRM sync", "Automated follow-ups"].map(text => (
                <li key={text} className="flex items-center gap-2 text-[12px] text-slate-600">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center"><CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /></div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="h-40 bg-slate-50 rounded-xl border border-slate-50 flex items-center justify-center">
                <span className="text-[9px] font-bold text-slate-200 uppercase tracking-widest">Interface Preview</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mb-3">AI Intelligence</div>
          <h2 className="text-[28px] font-bold text-[#111] mb-10 tracking-tight">Real-time insights</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="p-6 rounded-xl border border-slate-50 bg-slate-50/50">
              <h3 className="text-[15px] font-bold mb-2">Live Transcription</h3>
              <p className="text-[12px] text-slate-500 leading-relaxed">Watch calls turn into data in real-time. Never miss a detail with automated notes.</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-50 bg-slate-50/50">
              <h3 className="text-[15px] font-bold mb-2">Sentiment Analysis</h3>
              <p className="text-[12px] text-slate-500 leading-relaxed">Understand customer mood instantly. AI flags high-intent moments for your team.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0F172A] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-[28px] font-bold mb-4 tracking-tight">Ready to scale?</h2>
          <p className="text-slate-400 text-[14px] mb-8 max-w-sm mx-auto">Join the high-growth teams already using Closo to dominate their phone sales.</p>
          <Button className="bg-white text-[#111] hover:bg-slate-100 px-6 h-11 rounded-xl font-bold text-[13px]" onClick={() => window.location.href='https://app.thecloso.com'}>Get Started Now</Button>
        </div>
      </section>

      <EnterpriseFooter />
    </div>
  );
}