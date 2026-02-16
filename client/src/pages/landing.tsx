import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  PhoneCall,
  Zap,
  CheckCircle2,
  Mic,
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
  Layers,
  Activity,
  ArrowRight,
  ChevronRight,
  Plus
} from "lucide-react";
import { useLocation, Link } from "wouter";
import closoLogo from "../assets/closo_logo.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";
import { SEO } from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
};

export default function Landing() {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#A1A1AA] selection:bg-blue-500/30 font-sans tracking-tight overflow-x-hidden">
      <SEO 
        title="Closo | Intelligent Automation for Modern Businesses" 
        description="Xtract brings AI automation to your fingertips & streamlines tasks. Built for high-growth teams."
      />
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-6xl h-[800px] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.15] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6 pt-6"
      >
        <nav className={`flex items-center justify-between px-6 py-2.5 rounded-2xl border transition-all duration-500 ${showHeader ? 'bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl w-full max-w-[900px]' : 'bg-transparent border-transparent w-full max-w-[1100px]'}`}>
          <div className="flex items-center gap-12">
            <Link href="/"><img src={closoLogo} alt="Closo" className="h-7 w-auto object-contain brightness-0 invert" /></Link>
            <div className="hidden lg:flex items-center gap-8">
              {['Services', 'Process', 'Case Studies', 'Pricing'].map(item => (
                <div key={item} className="cursor-pointer group">
                  <span className="text-[13px] font-medium text-slate-400 group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://app.thecloso.com" className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors">Log in</a>
            <Button className="bg-white hover:bg-slate-200 text-black px-5 h-9 text-[13px] font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]" onClick={() => window.location.href='https://app.thecloso.com'}>Get Started</Button>
          </div>
        </nav>
      </motion.div>

      {/* Hero Section */}
      <section className="relative pt-56 pb-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 px-4 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em]">Intelligent Automation</span>
          </motion.div>

          <motion.h1 
            {...fadeIn}
            className="text-[48px] md:text-[84px] font-bold tracking-tight mb-8 leading-[0.95] text-white"
          >
            Intelligent <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-slate-500">Automation for</span> <br />
            Modern Businesses.
          </motion.h1>
          
          <motion.p 
            {...fadeIn}
            transition={{ delay: 0.1 }}
            className="text-[18px] text-slate-400 mb-12 max-w-2xl leading-relaxed font-normal"
          >
            Xtract brings AI automation to your fingertips & streamlines tasks. <br className="hidden md:block" />
            Empower your business with high-fidelity intelligence.
          </motion.p>
          
          <motion.div 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-5 mb-24"
          >
            <Button className="bg-white hover:bg-slate-200 text-black px-10 h-14 text-[15px] font-bold rounded-2xl shadow-2xl transition-all hover:scale-105" onClick={() => window.location.href='https://app.thecloso.com'}>Get in touch</Button>
            <Button variant="outline" className="px-10 h-14 text-[15px] font-bold border-white/10 text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-all flex items-center gap-2">View services <ArrowRight className="w-4 h-4" /></Button>
          </motion.div>

          {/* Trusted By */}
          <motion.div 
            {...fadeIn}
            transition={{ delay: 0.3 }}
            className="w-full flex flex-col items-center gap-8"
          >
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Over 50+ businesses trust us</span>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale brightness-200">
               {['HubSpot', 'Salesforce', 'Slack', 'Intercom', 'Linear'].map(name => (
                 <span key={name} className="text-xl font-black italic tracking-tighter text-white">{name}</span>
               ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section - Bento Grid */}
      <section id="services" className="py-32 border-t border-white/5 relative bg-[#080808]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-24">
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-4">Our Services</div>
            <h2 className="text-[40px] md:text-[56px] font-bold text-white tracking-tight leading-tight">AI Solutions That Take Your <br /> Business to the Next Level</h2>
            <p className="text-slate-500 mt-6 max-w-2xl mx-auto text-lg">We design, develop, and implement automation tools that help you work smarter, not harder</p>
          </div>

          <div className="grid md:grid-cols-12 gap-6">
            {/* Workflow Automation Card */}
            <motion.div 
              {...fadeIn}
              className="md:col-span-7 p-10 rounded-[3rem] bg-white/5 border border-white/10 relative overflow-hidden group min-h-[450px] flex flex-col justify-between"
            >
               <div className="relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-8 border border-blue-500/30">
                   <Zap className="w-6 h-6 text-blue-400" />
                 </div>
                 <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Automate repetitive tasks</h3>
                 <p className="text-slate-400 max-w-md text-[15px] leading-relaxed">We help you streamline internal operations by automating manual workflows like data entry, reporting, and approval chains saving time and cutting down errors.</p>
               </div>
               
               {/* Visual Element: Task List Animation */}
               <div className="mt-12 space-y-3 relative z-10">
                  {[
                    { label: "Payroll management", status: "Waiting for approval", color: "text-amber-400" },
                    { label: "Employee Tracking", status: "Due on 2nd july", color: "text-blue-400" },
                    { label: "Social media post", status: "2 days ago", color: "text-emerald-400" }
                  ].map((task, i) => (
                    <motion.div 
                      key={i}
                      initial={{ x: 50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      className="bg-black/40 border border-white/10 p-4 rounded-xl flex items-center justify-between backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <span className="text-[13px] font-medium text-white">{task.label}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${task.color}`}>{task.status}</span>
                    </motion.div>
                  ))}
               </div>

               <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />
            </motion.div>

            {/* AI Assistant Card */}
            <motion.div 
              {...fadeIn}
              className="md:col-span-5 p-10 rounded-[3rem] bg-white/5 border border-white/10 relative overflow-hidden group min-h-[450px] flex flex-col"
            >
               <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-8 border border-purple-500/30">
                 <Mic className="w-6 h-6 text-purple-400" />
               </div>
               <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Delegate Daily Tasks</h3>
               <p className="text-slate-400 text-[15px] leading-relaxed mb-8">From managing calendars to drafting emails and summarizing meetings, our AI assistants work around the clock.</p>
               
               {/* Chat Interface Preview */}
               <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-6 relative">
                  <div className="text-[11px] font-bold text-slate-500 mb-4">What can I help with?</div>
                  <div className="space-y-3">
                    <div className="bg-white/5 p-3 rounded-lg text-[12px] border border-white/5 text-slate-300">Generate quarterly report...</div>
                    <div className="bg-blue-500/20 p-3 rounded-lg text-[12px] border border-blue-500/30 text-blue-300 ml-8 italic">Analyzing data points...</div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 gap-2">
                    <Plus className="w-4 h-4 text-slate-500" />
                    <div className="text-[11px] text-slate-600">Give me command...</div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 border-t border-white/5 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="text-left">
              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-widest mb-4">Our Process</div>
              <h2 className="text-[40px] md:text-[56px] font-bold text-white tracking-tight leading-tight">Simple, Smart, and <br /> Scalable Process</h2>
            </div>
            <p className="text-slate-500 max-w-sm text-lg">We design, develop, and implement automation tools that help you work smarter, not harder</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Smart Analyzing", desc: "We assess your needs and identify AI solutions to streamline workflows." },
              { step: "02", title: "AI Development", desc: "Our team builds intelligent automation systems tailored to your business." },
              { step: "03", title: "Seamless Integration", desc: "We smoothly integrate AI solutions into your existing infrastructure." },
              { step: "04", title: "Continuous Optimization", desc: "We refine performance, analyze insights, and enhance for long-term growth." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="text-4xl font-black text-white/10 group-hover:text-blue-500/20 transition-colors mb-8 leading-none">{item.step}</div>
                <h4 className="text-xl font-bold text-white mb-4 tracking-tight">{item.title}</h4>
                <p className="text-[14px] text-slate-500 leading-relaxed font-normal">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies / Carousel Mockup */}
      <section className="py-32 border-t border-white/5 bg-[#080808]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-[40px] md:text-[56px] font-bold text-white tracking-tight">Smart AI Automation <br /> Transforms Businesses</h2>
          </div>
          
          <div className="flex gap-6 overflow-hidden pb-12">
            {[1, 2, 3].map((_, i) => (
              <motion.div 
                key={i}
                className="min-w-[400px] md:min-w-[600px] p-10 rounded-[3rem] bg-white/5 border border-white/10 flex flex-col justify-between"
              >
                <div className="mb-12">
                  <div className="text-blue-400 font-black text-4xl mb-8 leading-none opacity-20">"</div>
                  <p className="text-2xl font-bold text-white leading-tight italic">
                    {i === 0 && "AI-driven forecasting cut inventory waste by 40% for TrailForge"}
                    {i === 1 && "AI-powered workflows reduced error rate by 80% in daily operations"}
                    {i === 2 && "Automating 50% of operations saved 20% in costs within 2 months"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                   <div>
                     <div className="text-2xl font-bold text-white mb-1">
                        {i === 0 && "40%"}
                        {i === 1 && "80%"}
                        {i === 2 && "50%"}
                     </div>
                     <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Impact</div>
                   </div>
                   <div>
                     <div className="text-2xl font-bold text-white mb-1">
                        {i === 0 && "35%"}
                        {i === 1 && "90%"}
                        {i === 2 && "2x"}
                     </div>
                     <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Faster Rate</div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-black border-t border-white/5 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-[48px] md:text-[84px] font-bold mb-8 tracking-tight leading-[0.95] text-white italic underline underline-offset-8 decoration-blue-500/50">Ready to <br /> Scale.</h2>
          <p className="text-slate-400 text-[18px] mb-12 max-w-md mx-auto leading-relaxed">Join the high-growth teams already using Closo context infrastructure to dominate their outreach.</p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Button className="bg-white text-black hover:bg-slate-200 px-12 h-16 rounded-2xl font-black text-[16px] shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all hover:scale-105" onClick={() => window.location.href='https://app.thecloso.com'}>Get Started Now</Button>
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 px-12 h-16 rounded-2xl font-black text-[16px] transition-all">View Case Studies</Button>
          </div>
        </div>
        
        {/* Glow Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-blue-500/10 blur-[150px] rounded-full z-0" />
      </section>

      <EnterpriseFooter />
    </div>
  );
}