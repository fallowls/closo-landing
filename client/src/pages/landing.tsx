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
    <div className="min-h-screen bg-[#050505] text-[#A1A1AA] selection:bg-blue-500/30 font-sans tracking-tight overflow-x-hidden">
      <SEO 
        title="Closo | Context Engineering for Modern Sales" 
        description="The dialer infrastructure for high-growth teams. Automated CRM sync, AI scoring, and parallel dialing in one high-fidelity interface."
      />
      
      {/* Dynamic Dark Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6 pt-6"
      >
        <nav className={`flex items-center justify-between px-6 py-2 rounded-2xl border transition-all duration-500 ${showHeader ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl w-full max-w-[800px]' : 'bg-transparent border-transparent w-full max-w-[1000px]'}`}>
          <div className="flex items-center gap-10">
            <Link href="/"><img src={closoLogo} alt="Closo" className="h-7 w-auto cursor-pointer object-contain brightness-0 invert" /></Link>
            <div className="hidden lg:flex items-center gap-6">
              {['Infrastructure', 'Pricing', 'Docs'].map(item => (
                <div key={item} className="cursor-pointer group">
                  <span className="text-[12px] font-medium text-slate-400 group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://app.thecloso.com" className="text-[12px] font-medium text-slate-400 hover:text-white transition-colors">Log in</a>
            <Button className="bg-white hover:bg-slate-200 text-black px-4 h-8 text-[12px] font-bold rounded-xl transition-all active:scale-95" onClick={() => window.location.href='https://app.thecloso.com'}>Get Started</Button>
          </div>
        </nav>
      </motion.div>

      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 backdrop-blur-sm"
          >
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Context Infrastructure for Sales</span>
          </motion.div>

          <motion.h1 
            {...fadeIn}
            className="text-[44px] md:text-[72px] font-bold tracking-tight mb-8 leading-[1] text-white"
          >
            The dialer infrastructure <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-slate-400">for high-growth teams</span>
          </motion.h1>
          
          <motion.p 
            {...fadeIn}
            transition={{ ...fadeIn.transition, delay: 0.1 }}
            className="text-[17px] text-slate-400 mb-12 max-w-2xl leading-relaxed font-normal"
          >
            Closo gives your sales team state-of-the-art memory, automated lead scoring, CRM connectors, and parallel dialing - all built in. Extremely low latency.
          </motion.p>
          
          <motion.div 
            {...fadeIn}
            transition={{ ...fadeIn.transition, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-24"
          >
            <Button className="bg-white hover:bg-slate-200 text-black px-10 h-14 text-[15px] font-bold rounded-2xl shadow-2xl transition-all hover:scale-105" onClick={() => window.location.href='https://app.thecloso.com'}>Setup in 5 mins</Button>
            <Button variant="outline" className="px-10 h-14 text-[15px] font-bold border-white/10 text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-all">Talk to founder →</Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full max-w-5xl"
          >
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-2xl group">
              <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#171717_0%,#000000_100%)]" />
              
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
                        className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                      >
                        <Cloud className="w-12 h-12 text-blue-400" />
                        <div className="absolute -bottom-8 text-blue-400 text-[10px] font-bold uppercase tracking-widest">CRM Source</div>
                      </motion.div>
                      
                      <div className="flex flex-col gap-4">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="h-1 w-32 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full origin-left"
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
                        <div className="absolute -bottom-8 text-white text-[10px] font-bold uppercase tracking-widest">Closo Memory</div>
                      </motion.div>
                    </div>
                    <div className="absolute bottom-12 text-center">
                      <h3 className="text-white text-lg font-bold mb-2">Infinite Context Ingestion</h3>
                      <p className="text-slate-400 text-sm">Every contact interaction, note, and CRM detail synced instantly.</p>
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
                        { name: "Global Account", status: "Indexing", progress: 100 },
                        { name: "Strategic Lead", status: "Indexing", progress: 85 },
                        { name: "Key Stakeholder", status: "Ready", progress: 100 },
                        { name: "Enterprise Hub", status: "Indexing", progress: 92 }
                      ].map((contact, i) => (
                        <motion.div
                          key={i}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col gap-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-bold text-white">{contact.name}</div>
                            <div className="text-[10px] font-bold text-blue-400">{contact.status}</div>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${contact.progress}%` }}
                              transition={{ duration: 2, delay: i * 0.2 }}
                              className="h-full bg-blue-500"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="absolute bottom-12 text-center">
                      <h3 className="text-white text-lg font-bold mb-2">Automated Memory Indexing</h3>
                      <p className="text-slate-400 text-sm">AI-driven extraction of intent, sentiment, and relationship graphs.</p>
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
                              <PhoneCall className={`w-4 h-4 ${i === 1 ? 'text-blue-400' : 'text-white/20'}`} />
                            </div>
                            <motion.div 
                              className={`h-1 rounded-full ${i === 1 ? 'bg-blue-400' : 'bg-white/5'}`}
                              initial={{ width: 0 }}
                              animate={{ width: i === 1 ? 200 : 100 }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          </motion.div>
                        ))}
                      </div>
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1], rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center relative"
                      >
                        <Zap className="w-10 h-10 text-blue-400" />
                        <div className="absolute inset-[-10px] rounded-full border border-blue-500/20 border-dashed" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-12 text-center">
                      <h3 className="text-white text-lg font-bold mb-2">High-Fidelity Parallel Dialing</h3>
                      <p className="text-slate-400 text-sm">Scaling outbound without sacrificing context or quality.</p>
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
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { label: "Connect Rate", value: "+400%", icon: TrendingUp },
                        { label: "Data Accuracy", value: "99.9%", icon: ShieldCheck },
                        { label: "Time Saved", value: "12h/wk", icon: Sparkles },
                        { label: "Pipeline Lift", value: "3.2x", icon: BarChart3 }
                      ].map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm"
                        >
                          <stat.icon className="w-5 h-5 text-blue-400 mb-3" />
                          <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="absolute bottom-12 text-center">
                      <h3 className="text-white text-lg font-bold mb-2">Enterprise-Grade Performance</h3>
                      <p className="text-slate-400 text-sm">Built on context engineering infrastructure for scale.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-1 bg-white/10 rounded-full overflow-hidden">
                    {step === i && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 border-t border-white/5 bg-[#080808]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-6 h-full">
            <motion.div 
              {...fadeIn}
              className="md:col-span-8 p-10 rounded-[2.5rem] bg-white/5 border border-white/10 relative overflow-hidden group h-[400px]"
            >
               <div className="relative z-10 h-full flex flex-col justify-between">
                 <div>
                   <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Evolving Context Memory</h3>
                   <p className="text-slate-400 max-w-md text-sm leading-relaxed">Closo infers user intent and adapts facts, profiles, and insights as your CRM data evolves. Your dialer isn't just a phone anymore—it's an intelligent agent.</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">Low Latency</div>
                    <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest">High Accuracy</div>
                 </div>
               </div>
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                 className="absolute top-1/2 -right-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px]"
               />
            </motion.div>

            <motion.div 
              {...fadeIn}
              className="md:col-span-4 p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col justify-center items-center text-center h-[400px]"
            >
               <div className="w-20 h-20 rounded-[2rem] bg-blue-500/20 flex items-center justify-center mb-8">
                 <Zap className="w-10 h-10 text-blue-400" />
               </div>
               <h3 className="text-xl font-bold text-white mb-4">50M Tokens</h3>
               <p className="text-slate-400 text-sm leading-relaxed">Scalable infrastructure built on Postgres for global enterprise scale.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-[36px] font-bold text-white tracking-tight">Context infrastructure that <br /> adapts to every use-case</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "AI Assistants", desc: "Build intelligent sales reps with state-of-the-art memory." },
              { icon: Target, title: "Education Hubs", desc: "Personalized search and automated qualification." },
              { icon: ShieldCheck, title: "Healthcare Records", desc: "Bank-level encryption for sensitive medical records." },
              { icon: Globe, title: "Global Infrastructure", desc: "Low latency dialing built on global server clusters." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center group"
              >
                <item.icon className="w-8 h-8 text-blue-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-white font-bold mb-3">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#0A0A0A] border-t border-white/5 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-[44px] md:text-[64px] font-bold mb-8 tracking-tight leading-[1] text-white">Scale your sales <br /> beyond memory.</h2>
          <p className="text-slate-400 text-[18px] mb-12 max-w-md mx-auto leading-relaxed">Join the high-growth teams already using Closo context infrastructure to dominate their outreach.</p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Button className="bg-white text-black hover:bg-slate-200 px-10 h-14 rounded-2xl font-bold text-[15px] shadow-2xl transition-all hover:scale-105" onClick={() => window.location.href='https://app.thecloso.com'}>Get Started Now</Button>
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 px-10 h-14 rounded-2xl font-bold text-[15px] transition-all">View Docs</Button>
          </div>
        </div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px]" 
        />
      </section>

      <EnterpriseFooter />
    </div>
  );
}