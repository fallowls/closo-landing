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
  ArrowUpRight
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

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
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
              {['Features', 'Intelligence', 'Pricing', 'Docs'].map(item => (
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

      <section className="py-24 bg-white border-y border-slate-50">
        <div className="max-w-5xl mx-auto px-6">
           <div className="text-center mb-16">
             <div className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3">Core Platform</div>
             <h2 className="text-[28px] font-bold text-[#111] tracking-tight">Built for high-growth</h2>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Parallel Dialer", icon: Zap, desc: "Stop wasting time on ringing tones. Our parallel dialer calls multiple prospects and connects you only when a human answers." },
                { title: "AI Intelligence", icon: Mic, desc: "Real-time transcription and sentiment analysis. AI flags high-intent moments instantly for your team." },
                { title: "CRM Sync Hub", icon: RefreshCw, desc: "Unified data intelligence synced to your entire stack. No more manual CRM entry or data silos." }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-2xl border border-slate-100 bg-white text-left hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-6"><item.icon className="w-5 h-5 text-blue-600" /></div>
                  <h3 className="text-[16px] font-bold text-[#111] mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed font-normal">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">Modern Outbound</div>
              <h2 className="text-[32px] font-bold text-[#111] leading-tight tracking-tight">Add a new <br /> sales channel</h2>
              <p className="text-[15px] text-slate-500 leading-relaxed font-normal">
                Closo transforms your phone sales from a manual chore into a high-performance data engine.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: Target, title: "Precision Targeting", desc: "Call leads exactly when they're most engaged." },
                  { icon: Volume2, title: "Voicemail Drops", desc: "Personalized follow-ups without manual effort." },
                  { icon: Activity, title: "Campaign Analytics", desc: "Track performance across every segment." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                      <item.icon className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#111]">{item.title}</div>
                      <div className="text-[12px] text-slate-400">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl">
               <div className="flex items-center gap-2 mb-8">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tracking-widest">Active Call (0:03)</span>
               </div>
               <div className="flex flex-col items-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 border-4 border-slate-50 shadow-inner">
                    <Users className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="text-lg font-bold text-[#111]">Charlie Hawkins</div>
                  <div className="text-xs text-slate-400 font-medium">+1 (514) 257-8561</div>
               </div>
               <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-10 rounded-lg text-[12px] font-bold border-slate-100">Voicemail</Button>
                  <Button className="w-10 h-10 p-0 bg-rose-500 hover:bg-rose-600 rounded-lg shadow-lg"><PhoneCall className="w-4 h-4 text-white rotate-[135deg]" /></Button>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3">Features & Insights</div>
            <h2 className="text-[32px] font-bold text-[#111] tracking-tight">Everything you need to dominate</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Search, title: "Lead Scoring", desc: "Identify high-value leads automatically." },
              { icon: ShieldCheck, title: "Encrypted Data", desc: "Secure handling of sensitive contact info." },
              { icon: BarChart3, title: "Deep Insights", desc: "Advanced business intelligence tools." },
              { icon: Lock, title: "Auth Management", desc: "Secure session-based access control." },
              { icon: Globe, title: "Global Reach", desc: "Connect with prospects anywhere on earth." },
              { icon: MessageSquare, title: "Live Community", desc: "Two-way communication with admin team." },
              { icon: TrendingUp, title: "Sales Growth", desc: "Measure revenue impact of every interaction." },
              { icon: MousePointer2, title: "Easy Workflow", desc: "Seamless navigation across the platform." }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all group">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mb-4 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform"><feature.icon className="w-4 h-4 text-blue-600" /></div>
                <h4 className="text-[14px] font-bold text-[#111] mb-1">{feature.title}</h4>
                <p className="text-[11px] text-slate-500 leading-normal font-normal">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-6">
            <div className="text-[9px] font-bold text-purple-600 uppercase tracking-wider">The Integration</div>
            <h2 className="text-[32px] font-bold text-[#111] leading-tight tracking-tight">Unified workflow. <br /> Maximum impact.</h2>
            <p className="text-[15px] text-slate-500 leading-relaxed font-normal">
              Stop switching tabs. Closo brings your entire sales workflow into a single, compact interface that matches your pace.
            </p>
            <ul className="space-y-4">
              {[
                { title: "Smart intent detection", desc: "AI identifies the best time to call each lead." },
                { title: "Instant CRM sync", desc: "Data flows instantly to Salesforce and HubSpot." },
                { title: "Automated follow-ups", desc: "Never miss a missed connection again." }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center mt-1 flex-shrink-0"><CheckCircle2 className="w-3 h-3 text-emerald-500" /></div>
                  <div>
                    <div className="text-[14px] font-bold text-slate-700">{item.title}</div>
                    <div className="text-[12px] text-slate-400">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg">
              <div className="h-64 bg-slate-50 rounded-xl border border-slate-50 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"><Layers className="w-6 h-6 text-blue-600" /></div>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Interface Preview</span>
                <div className="w-32 h-2 bg-slate-100 rounded-full" />
                <div className="w-24 h-2 bg-slate-100 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-y border-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mb-3">AI Intelligence</div>
          <h2 className="text-[32px] font-bold text-[#111] mb-12 tracking-tight">Real-time insights for every call</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/20 hover:bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-sm"><Activity className="w-5 h-5 text-emerald-600" /></div>
              <h3 className="text-[17px] font-bold text-[#111] mb-3 tracking-tight">Live Transcription</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed font-normal">Watch calls turn into data in real-time. Never miss a detail with automated notes and transcription directly in your CRM.</p>
            </div>
            <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/20 hover:bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-sm"><ArrowUpRight className="w-5 h-5 text-emerald-600" /></div>
              <h3 className="text-[17px] font-bold text-[#111] mb-3 tracking-tight">Sentiment Analysis</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed font-normal">Understand customer mood instantly. AI flags high-intent moments, enabling your team to capitalize on interest immediately.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0F172A] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-[36px] font-bold mb-6 tracking-tight">Ready to scale your commerce?</h2>
          <p className="text-slate-400 text-[15px] mb-10 max-w-md mx-auto leading-relaxed">Join the high-growth teams already using Closo to dominate their phone sales and streamline lead intelligence.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-white text-[#111] hover:bg-slate-100 px-8 h-12 rounded-xl font-bold text-[14px]" onClick={() => window.location.href='https://app.thecloso.com'}>Get Started Now</Button>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white px-8 h-12 rounded-xl font-bold text-[14px]">Talk to Sales</Button>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </div>
  );
}