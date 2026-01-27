import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  PhoneCall,
  Users,
  Zap,
  CheckCircle2,
  Layers,
  Mic,
  Activity,
  RefreshCw,
  Search,
  Target,
  BarChart3,
  Lock,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Globe,
  Sparkles,
  Database,
  Cloud,
  MousePointer2
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

export default function Landing() {
  const [showHeader, setShowHeader] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1e293b] selection:bg-blue-100 font-sans tracking-tight overflow-x-hidden">
      <SEO 
        title="Closo | The phone platform for B2B commerce" 
        description="Engage with your customers profitably on the phone with parallel dialing, AI intelligence, and deep CRM automation."
      />
      
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(circle_at_50%_50%,#eff6ff_0%,#ffffff_100%)]" />
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
              {['Features', 'Intelligence', 'Security', 'Pricing'].map(item => (
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

      <section className="relative pt-40 pb-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.h1 
            {...fadeIn}
            className="text-[40px] md:text-[64px] font-bold tracking-tight mb-8 leading-[1.05] text-slate-900"
          >
            Modern phone sales <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">for high-growth teams</span>
          </motion.h1>
          
          <motion.p 
            {...fadeIn}
            transition={{ ...fadeIn.transition, delay: 0.1 }}
            className="text-[16px] text-slate-500 mb-12 max-w-lg leading-relaxed font-normal"
          >
            The world's first phone platform that actually helps you sell. Automated CRM sync, AI scoring, and parallel dialing in one compact interface.
          </motion.p>
          
          <motion.div 
            {...fadeIn}
            transition={{ ...fadeIn.transition, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-20"
          >
            <Button className="bg-[#111] hover:bg-[#000] text-white px-10 h-14 text-[15px] font-bold rounded-2xl shadow-xl transition-all hover:scale-105" onClick={() => window.location.href='https://app.thecloso.com'}>Start free trial</Button>
            <Button variant="outline" className="px-10 h-14 text-[15px] font-bold border-slate-200 text-slate-600 bg-white rounded-2xl hover:bg-slate-50 transition-all">Book a demo</Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full max-w-5xl"
          >
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
              <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#0f172a_100%)]" />
              
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div 
                    key="crm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center p-12"
                  >
                    <div className="flex items-center gap-12">
                      <motion.div 
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="w-24 h-24 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center backdrop-blur-sm"
                      >
                        <Cloud className="w-12 h-12 text-blue-400" />
                        <div className="absolute -bottom-8 text-blue-400 text-[10px] font-bold uppercase tracking-widest">Your CRM</div>
                      </motion.div>
                      
                      <div className="flex flex-col gap-4">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="h-1 w-32 bg-gradient-to-r from-blue-500/50 to-indigo-500/50 rounded-full origin-left"
                          />
                        ))}
                      </div>

                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl relative"
                      >
                        <Database className="w-14 h-14 text-white" />
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-3xl border border-blue-500/30 border-dashed"
                        />
                        <div className="absolute -bottom-8 text-white text-[10px] font-bold uppercase tracking-widest">Closo Engine</div>
                      </motion.div>
                    </div>
                    <div className="absolute bottom-12 text-center">
                      <h3 className="text-white text-lg font-bold mb-2">Instant CRM Sync</h3>
                      <p className="text-slate-400 text-sm">Automated data ingestion from Salesforce, HubSpot, and 50+ CRMs.</p>
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div 
                    key="contact"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl px-12">
                      {[
                        { name: "John Smith", score: "98", color: "text-emerald-400" },
                        { name: "Sarah Doe", score: "92", color: "text-emerald-400" },
                        { name: "Mike Ross", score: "45", color: "text-slate-400" },
                        { name: "Emma Vane", score: "89", color: "text-emerald-400" }
                      ].map((contact, i) => (
                        <motion.div
                          key={i}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800" />
                            <div className="text-xs font-bold text-white">{contact.name}</div>
                          </div>
                          <div className={`text-xs font-black ${contact.color}`}>{contact.score}</div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="absolute bottom-12 text-center">
                      <h3 className="text-white text-lg font-bold mb-2">AI Lead Scoring</h3>
                      <p className="text-slate-400 text-sm">Identifying high-intent decision-makers automatically.</p>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="dialer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="relative w-full max-w-3xl flex justify-center items-center gap-12">
                      <div className="flex flex-col gap-6">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            className="flex items-center gap-4"
                          >
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                              <PhoneCall className={`w-4 h-4 ${i === 1 ? 'text-emerald-400' : 'text-blue-400'}`} />
                            </div>
                            <motion.div 
                              className={`h-1 rounded-full ${i === 1 ? 'bg-emerald-400' : 'bg-blue-400/30'}`}
                              initial={{ width: 0 }}
                              animate={{ width: i === 1 ? 160 : 80 }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          </motion.div>
                        ))}
                      </div>
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center"
                      >
                        <Zap className="w-10 h-10 text-emerald-400" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-12 text-center">
                      <h3 className="text-white text-lg font-bold mb-2">Parallel Dialer</h3>
                      <p className="text-slate-400 text-sm">Dialing 10 lines at once. Human detection skips voicemails.</p>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center p-12"
                  >
                    <div className="flex gap-8">
                      {[
                        { label: "Connect Rate", value: "+400%", icon: TrendingUp },
                        { label: "Rev Impact", value: "3.2x", icon: Sparkles }
                      ].map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.2 }}
                          className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center backdrop-blur-sm"
                        >
                          <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                          <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="absolute bottom-12 text-center">
                      <h3 className="text-white text-lg font-bold mb-2">Revenue Growth</h3>
                      <p className="text-slate-400 text-sm">3x higher conversion without adding headcount.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                    {step === i && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="h-full bg-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-white border-y border-slate-50">
        <div className="max-w-5xl mx-auto px-6">
           <div className="text-center mb-20">
             <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">Core Platform</div>
             <h2 className="text-[36px] font-bold text-[#111] tracking-tight">Built for high-performance sales</h2>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Parallel Dialer", icon: Zap, desc: "Scale outbound volume without manual friction. Connect with 3x more prospects instantly." },
                { title: "AI Intelligence", icon: Mic, desc: "Real-time transcription and qualification with human-like AI. Handle 24/7 high-volume leads." },
                { title: "CRM Sync Hub", icon: RefreshCw, desc: "Unified data intelligence synced to your entire stack. No more manual data entry." }
              ].map((item, i) => (
                <div key={i} className="p-10 rounded-3xl border border-slate-100 bg-white text-left hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all"><item.icon className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold text-[#111] mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-[14px] text-slate-500 leading-relaxed font-normal">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      <section className="py-32 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-4">The Toolkit</div>
            <h2 className="text-[36px] font-bold text-[#111] tracking-tight">Everything for high-volume sales</h2>
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
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-8 rounded-3xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-6"><feature.icon className="w-5 h-5 text-blue-600" /></div>
                <h4 className="text-[15px] font-bold text-[#111] mb-2">{feature.title}</h4>
                <p className="text-[12px] text-slate-400 leading-normal">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#0F172A] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-[44px] font-bold mb-8 tracking-tight leading-[1.1]">Join the high-growth teams <br /> scaling with Closo.</h2>
          <p className="text-slate-400 text-[18px] mb-12 max-w-md mx-auto leading-relaxed">Stop wasting time on manual outreach. Let Closo handle the friction while you handle the closing.</p>
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