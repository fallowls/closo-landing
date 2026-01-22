import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PhoneCall,
  Users,
  Zap,
  ChevronRight,
  Globe,
  CheckCircle2,
  Search,
  Layers,
  ShieldCheck,
  MessageSquare,
  ArrowUpRight,
  Mic,
  Volume2,
  Lock,
  Play,
  Activity,
  BarChart3,
  MousePointer2,
  Headphones,
  Database,
  Terminal,
  Cpu,
  RefreshCw,
  TrendingUp,
  Target
} from "lucide-react";
import { useLocation, Link } from "wouter";
import closoLogo from "../assets/closo_full_logo.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";
import { SEO } from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
};

const AbstractHub = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Central Core */}
    <motion.div
      animate={{ 
        scale: [1, 1.02, 1],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-[#111] to-[#444] shadow-2xl shadow-black/10 flex items-center justify-center z-10 transform-gpu backface-hidden"
    >
      <PhoneCall className="w-10 h-10 text-white stroke-[1.5] transform-gpu" />
    </motion.div>

    {/* Orbital Rings - Thinner and more subtle */}
    {[1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{ rotate: 360 }}
        transition={{ duration: 25 + i * 10, repeat: Infinity, ease: "linear" }}
        className="absolute border border-slate-200/40 rounded-full"
        style={{ 
          width: `${180 + i * 80}px`, 
          height: `${180 + i * 80}px`,
          opacity: 0.3 - i * 0.1
        }}
      />
    ))}

    {/* Floating Data Nodes - Reduced count and smaller */}
    {[
      { icon: Mic, pos: "top-[-10px] left-[45%]", color: "bg-white border border-slate-100 shadow-sm" },
      { icon: Activity, pos: "bottom-[10px] right-[40%]", color: "bg-white border border-slate-100 shadow-sm" },
    ].map((node, i) => (
      <motion.div
        key={i}
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute ${node.pos} w-8 h-8 rounded-xl ${node.color} flex items-center justify-center z-20 overflow-hidden backface-hidden perspective-1000 transform-gpu`}
        style={{ WebkitBackfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}
      >
        <node.icon className="w-4 h-4 text-[#111] transform-gpu" />
      </motion.div>
    ))}

    {/* Connection Lines (Visual Decor) */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 5 }}>
       <motion.circle 
         cx="50%" cy="50%" r="100" 
         fill="none" stroke="url(#gradient)" strokeWidth="0.5" strokeDasharray="4 4"
         animate={{ rotate: -360 }}
         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
       />
       <defs>
         <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
           <stop offset="0%" stopColor="#111" stopOpacity="0.2" />
           <stop offset="100%" stopColor="#666" stopOpacity="0.2" />
         </linearGradient>
       </defs>
    </svg>
  </div>
);

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
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 opacity-[0.6] bg-gradient-to-tr from-blue-50 via-white to-slate-50" />
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, #e2e8f0 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-6 left-0 right-0 z-50 flex justify-center px-6`}
      >
        <nav className={`flex items-center justify-between px-8 py-3 rounded-2xl border transition-all duration-500 ${showHeader ? 'bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] w-full max-w-[900px]' : 'bg-transparent border-transparent w-full max-w-[1200px]'}`}>
          <div className="flex items-center gap-12">
            <Link href="/"><img src={closoLogo} alt="Closo" className="h-7 w-auto cursor-pointer object-contain" /></Link>
            <div className="hidden lg:flex items-center gap-8">
              {['Features', 'Intelligence', 'Pricing'].map(item => (
                <div key={item} className="flex items-center gap-1 cursor-pointer group">
                  <span className="text-[13px] font-semibold text-slate-500 group-hover:text-[#111] transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[13px] font-semibold text-slate-500 hover:text-[#111] transition-colors">Log in</Link>
            <Button className="bg-[#111] hover:bg-[#000] text-white px-6 h-10 text-[13px] font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02]" onClick={() => window.location.href='/dashboard'}>Get Started</Button>
          </div>
        </nav>
      </motion.div>

      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-left">
            <motion.h1 
              {...fadeIn}
              transition={{ delay: 0.3 }}
              className="text-[52px] md:text-[80px] font-extrabold tracking-tight mb-8 leading-[0.9] text-slate-900"
            >
              The phone <br /> 
              platform for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">B2B commerce</span>
            </motion.h1>
            
            <motion.p 
              {...fadeIn}
              transition={{ delay: 0.4 }}
              className="text-[19px] text-slate-600/90 mb-12 max-w-lg leading-relaxed font-medium"
            >
              Empower your sales team with parallel dialing, real-time AI insights, and seamless CRM synchronization.
            </motion.p>
            
            <motion.div 
              {...fadeIn}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-14 text-sm font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02]" onClick={() => window.location.href='/dashboard'}>Start for free</Button>
              <Button variant="outline" size="lg" className="px-8 h-14 text-sm border-slate-200 text-slate-700 bg-white rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all">Book a demo</Button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full aspect-square flex items-center justify-center"
          >
            <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/50">
              <img 
                src="/src/assets/hero-main.png" 
                alt="Closo Platform" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
            </div>
            
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -left-4 top-1/4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 z-30 animate-bounce-slow min-w-[180px] backface-hidden perspective-1000 transform-gpu"
              style={{ WebkitBackfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}
            >
              <div className="flex items-center gap-2 mb-1 transform-gpu">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Voicemail dropped</span>
              </div>
              <div className="text-2xl font-black text-[#111] tracking-tight transform-gpu">$24,850</div>
              <div className="text-[9px] text-slate-400 font-bold transform-gpu">Total revenue</div>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="absolute -right-4 top-2/3 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 z-30 animate-float min-w-[200px] backface-hidden perspective-1000 transform-gpu"
              style={{ WebkitBackfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}
            >
               <div className="flex items-center gap-3 transform-gpu">
                 <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-[12px] font-black">CH</div>
                 <div className="text-left">
                   <div className="text-[12px] font-black text-[#111]">Charlie Hawkins</div>
                   <div className="flex gap-1 mt-0.5">
                      <div className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[8px] font-black uppercase tracking-wider">Active</div>
                   </div>
                 </div>
               </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto">
        </div>
      </section>

      <section className="py-32 bg-white text-center overflow-hidden">
        <motion.div 
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6"
        >
           <motion.div variants={fadeIn} className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mb-8 border border-slate-100/50">Introducing Closo</motion.div>
           <motion.h2 variants={fadeIn} className="text-[48px] md:text-[64px] font-black text-[#111] mb-6 leading-[1.1] tracking-tighter">A voice platform <br /> built for high-growth</motion.h2>
           <motion.p variants={fadeIn} className="text-[20px] text-slate-500/80 mb-20 max-w-3xl mx-auto font-medium leading-relaxed">Everything you need to turn every phone interaction into a measurable revenue driver.</motion.p>
           
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Power Dialer", icon: PhoneCall, color: "text-[#0000EE]", bg: "bg-[#0000EE]/5", desc: "Scale outbound volume without the manual friction. Connect with up to 3x more prospects." },
                { title: "Voice Agents", icon: Mic, color: "text-[#0000EE]", bg: "bg-[#0000EE]/5", desc: "Automate intake and qualification with human-like AI. Handle 24/7 high-volume leads." },
                { title: "Phone Hub", icon: Layers, color: "text-[#0000EE]", bg: "bg-[#0000EE]/5", desc: "Unified data intelligence synced to your entire stack. No more manual CRM data entry." }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn}>
                  <Card className="bg-white border border-slate-100 rounded-[2.5rem] p-10 text-left hover:shadow-2xl hover:shadow-[#0000EE]/5 transition-all cursor-pointer group h-full">
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}><item.icon className={`w-6 h-6 ${item.color} stroke-[1.5]`} /></div>
                    <h3 className="text-2xl font-black text-[#111] mb-3 tracking-tight">{item.title}</h3>
                    <p className="text-[14px] text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                  </Card>
                </motion.div>
              ))}
           </div>
        </motion.div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-[11px] font-black uppercase tracking-wider">Outbound Phone</div>
            <h2 className="text-[44px] font-bold text-[#111] leading-tight tracking-tight">Add a new <br /> sales channel</h2>
            <ul className="space-y-4 text-[17px] text-slate-600 font-medium">
               <li className="flex gap-2"><span className="text-purple-500 font-bold">•</span><span>Call shoppers at the perfect moment based on intent.</span></li>
               <li className="flex gap-2"><span className="text-purple-500 font-bold">•</span><span>Automatically drop personalized voicemails to missed calls.</span></li>
               <li className="flex gap-2"><span className="text-purple-500 font-bold">•</span><span>Run campaigns on high-value segments like abandoned carts.</span></li>
            </ul>
            <Button className="bg-[#111] text-white px-8 h-12 rounded-xl font-bold text-sm shadow-lg">Tour the platform</Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-[#E1B2FF]/10 rounded-[3rem] p-10"
          >
            <Card className="bg-white rounded-[2.5rem] border-none shadow-xl p-10 relative">
               <div className="flex items-center gap-2 mb-10">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Call in progress (0:03)</span>
               </div>
               <div className="flex flex-col items-center mb-10">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-50 mb-6 shadow-lg">
                     <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" alt="Caller" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xl font-black text-[#111]">Charlie Hawkins</div>
                  <div className="text-sm text-slate-400">+1 (514) 257-8561</div>
               </div>
               <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 h-12 rounded-xl text-[13px] font-bold gap-2 border-slate-100"><Volume2 className="w-4 h-4 text-slate-400" /> Voicemail</Button>
                  <Button className="w-12 h-12 p-0 bg-rose-500 hover:bg-rose-600 rounded-xl"><PhoneCall className="w-5 h-5 text-white rotate-[135deg]" /></Button>
               </div>
               <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-10 -left-16 bg-white rounded-2xl shadow-xl border border-slate-50 p-8 w-64 animate-float"
               >
                  <div className="text-[12px] font-black text-[#111] mb-6 uppercase tracking-widest">Call list</div>
                  <div className="space-y-6">
                     {[
                       { name: "Oscar Reed", phone: "415-985", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" },
                       { name: "Fiona Clark", phone: "514-869", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" }
                     ].map((c, i) => (
                       <div key={i} className="flex items-center gap-4">
                          <img src={c.img} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="" />
                          <div>
                             <div className="text-[12px] font-bold text-[#111] leading-none mb-1">{c.name}</div>
                             <div className="text-[10px] text-slate-400 font-medium">{c.phone}</div>
                          </div>
                       </div>
                     ))}
                  </div>
               </motion.div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Parallel Dialer Benefits Section */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-[11px] font-black uppercase tracking-wider">Parallel Dialing</div>
            <h2 className="text-[44px] font-bold text-[#111] leading-tight tracking-tight">Triple your <br /> connect rates</h2>
            <p className="text-[17px] text-slate-500 font-medium leading-relaxed">
              Stop wasting time on ringing tones and busy signals. Our parallel dialer calls multiple prospects simultaneously and instantly connects you only when a human answers.
            </p>
            <div className="space-y-4">
              {[
                { title: "3x Productivity", desc: "Spend more time talking, less time waiting." },
                { title: "Smart Detection", desc: "Instantly skips voicemails and busy signals." },
                { title: "CRM Integration", desc: "Automated logging for every call attempt." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#111]">{item.title}</div>
                    <div className="text-[13px] text-slate-400 font-medium">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-blue-50/50 rounded-[3rem] p-8 aspect-square flex items-center justify-center overflow-hidden"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Animated Parallel Dialing Visualization */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-64 h-24 bg-white rounded-2xl shadow-xl border border-blue-100 p-4 flex items-center gap-4"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ 
                    x: [100, 0, 0, -100],
                    opacity: [0, 1, 1, 0],
                    y: (i - 1) * 110
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    delay: i * 1.3,
                    ease: "easeInOut" 
                  }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {i === 1 ? <PhoneCall className="w-5 h-5" /> : <RefreshCw className="w-5 h-5 animate-spin-slow" />}
                  </div>
                  <div className="flex-1">
                    <div className="h-3 w-24 bg-slate-100 rounded-full mb-2 overflow-hidden">
                      <motion.div 
                        className={`h-full ${i === 1 ? 'bg-emerald-500' : 'bg-blue-400'}`}
                        animate={{ width: ["0%", "100%"] }}
                        transition={{ duration: 1.5, delay: i * 1.3 }}
                      />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {i === 1 ? "Connected" : "Dialing..."}
                    </div>
                  </div>
                  {i === 1 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
              
              {/* Center Connection Node */}
              <div className="absolute w-20 h-20 rounded-full bg-[#111] shadow-2xl shadow-black/20 flex items-center justify-center z-10">
                <Users className="w-8 h-8 text-white" />
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-white/20"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Parallel Dialer "How it Works" Section */}
      <section className="py-32 bg-[#F9F9FB] border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 relative bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100 overflow-hidden min-h-[400px]"
          >
            {/* Step-by-step Process Animation */}
            <div className="space-y-12 relative z-10">
              {[
                { step: "01", title: "Select Leads", desc: "Pick your high-value segment from CRM.", icon: Users },
                { step: "02", title: "Launch Dial", desc: "Closo dials up to 5 lines at once.", icon: Zap },
                { step: "03", title: "Live Connect", desc: "Speak only when someone picks up.", icon: PhoneCall },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.3 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0000EE] font-black text-xs">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#111] mb-1 flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-[#0000EE]" /> {item.title}
                    </h4>
                    <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Background Decorative Flow */}
            <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.path
                  d="M0,50 Q25,0 50,50 T100,50"
                  fill="none"
                  stroke="#0000EE"
                  strokeWidth="0.5"
                  animate={{ d: ["M0,50 Q25,0 50,50 T100,50", "M0,50 Q25,100 50,50 T100,50", "M0,50 Q25,0 50,50 T100,50"] }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
              </svg>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 space-y-6"
          >
            <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[11px] font-black uppercase tracking-wider">How it works</div>
            <h2 className="text-[44px] font-bold text-[#111] leading-tight tracking-tight">The mechanics of <br /> high-velocity sales</h2>
            <p className="text-[17px] text-slate-500 font-medium leading-relaxed">
              Our parallel dialer isn't just fast; it's intelligent. It handles the manual grunt work of dialing, ringing, and navigating phone trees so you only ever hear "Hello?".
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-2xl font-black text-[#0000EE] mb-1">0s</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Wait Time</div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-2xl font-black text-[#0000EE] mb-1">5x</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intelligence Section */}
      <section className="py-24 bg-[#F9F9FB] border-y border-slate-100">
        <motion.div 
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center"
        >
          <div className="order-2 lg:order-1 relative">
             <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BarChart3, label: "Sentiment", val: "Positive", color: "text-emerald-500" },
                  { icon: MousePointer2, label: "Intent", val: "High", color: "text-[#0000EE]" },
                  { icon: Headphones, label: "Topic", val: "Pricing", color: "text-purple-500" },
                  { icon: Database, label: "Sync", val: "Live", color: "text-rose-500" }
                ].map((f, i) => (
                  <motion.div key={i} variants={fadeIn}>
                    <Card className="bg-white border-none rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                       <f.icon className={`w-5 h-5 ${f.color} mb-3`} />
                       <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{f.label}</div>
                       <div className="text-lg font-black text-[#111]">{f.val}</div>
                    </Card>
                  </motion.div>
                ))}
             </div>
          </div>
          <motion.div variants={fadeIn} className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center px-3 py-1 bg-[#E1B2FF]/20 text-[#E1B2FF] rounded-lg text-[11px] font-black uppercase tracking-wider">AI Phone Hub</div>
            <h2 className="text-[44px] font-bold text-[#111] leading-tight tracking-tight">Intelligence on <br /> every conversation</h2>
            <p className="text-[17px] text-slate-500 font-medium leading-relaxed">
              Closo automatically transcribes, summarizes, and extracts key insights from every call, so your team can focus on closing deals.
            </p>
            <div className="space-y-4">
               {[
                 "Automatic CRM updates",
                 "Live sentiment analysis",
                 "Customizable sales triggers"
               ].map((text, i) => (
                 <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#0000EE]" /> {text}
                 </div>
               ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Automation & Workflow */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[11px] font-black uppercase tracking-wider">Automation</div>
            <h2 className="text-[44px] font-bold text-[#111] leading-tight tracking-tight">Workflow that <br /> works for you</h2>
            <p className="text-[17px] text-slate-500 font-medium leading-relaxed">
              Eliminate manual data entry and repetitive tasks. Closo integrates deeply with your existing B2B commerce tools to automate the entire phone sales cycle.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
               {[
                 { icon: RefreshCw, title: "Real-time Sync", desc: "Instantly update order status and customer notes." },
                 { icon: Target, title: "Smart Routing", desc: "Connect customers to the right agent every time." },
                 { icon: Cpu, title: "AI Workflows", desc: "Trigger actions based on call outcomes automatically." },
                 { icon: Terminal, title: "Custom APIs", desc: "Build tailored solutions with our robust API." }
               ].map((item, i) => (
                 <div key={i} className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#111] mb-3">
                       <item.icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-[15px] font-bold text-[#111]">{item.title}</h4>
                    <p className="text-[13px] text-slate-400 leading-snug">{item.desc}</p>
                 </div>
               ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
             <div className="bg-[#111] rounded-[3rem] p-10 text-white overflow-hidden shadow-2xl">
                <div className="flex items-center gap-4 mb-12 opacity-50">
                   <div className="w-3 h-3 rounded-full bg-rose-500" />
                   <div className="w-3 h-3 rounded-full bg-amber-500" />
                   <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-6 font-mono text-[13px]">
                   <div className="flex gap-4">
                      <span className="text-emerald-400">01</span>
                      <span className="text-slate-400">{"{"}</span>
                   </div>
                   <div className="flex gap-4 pl-4">
                      <span className="text-emerald-400">02</span>
                      <span><span className="text-[#E1B2FF]">"event"</span>: <span className="text-amber-300">"call_completed"</span>,</span>
                   </div>
                   <div className="flex gap-4 pl-4">
                      <span className="text-emerald-400">03</span>
                      <span><span className="text-[#E1B2FF]">"summary"</span>: <span className="text-amber-300">"Customer interested in bulk order."</span>,</span>
                   </div>
                   <div className="flex gap-4 pl-4">
                      <span className="text-emerald-400">04</span>
                      <span><span className="text-[#E1B2FF]">"action"</span>: <span className="text-amber-300">"create_hubspot_deal"</span></span>
                   </div>
                   <div className="flex gap-4">
                      <span className="text-emerald-400">05</span>
                      <span className="text-slate-400">{"}"}</span>
                   </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#E1B2FF] flex items-center justify-center text-[#111] font-bold">C</div>
                      <span className="text-[12px] font-bold">API Status: Online</span>
                   </div>
                   <div className="text-[11px] font-bold uppercase tracking-widest text-[#E1B2FF]">200 OK</div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center border-t border-slate-50 pt-24">
            <motion.div {...fadeIn} className="space-y-6">
              <div className="inline-flex items-center px-2 py-0.5 bg-[#0000EE]/5 text-[#0000EE] rounded text-[10px] font-black uppercase tracking-wider">Parallel Dialing</div>
              <h2 className="text-[32px] md:text-[44px] font-black text-[#111] leading-[1.1] tracking-tighter">Dial multiple lines at once. <br />Talk to only humans.</h2>
              <p className="text-[15px] text-slate-500 font-medium leading-relaxed max-w-md">Our parallel dialer automatically detects voicemails and busy signals, only connecting your agents when a live person answers.</p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { label: "Connectivity", val: "3x", desc: "Agent efficiency" },
                  { label: "Voicemail", val: "100%", desc: "Accurate detection" }
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl">
                    <div className="text-2xl font-black text-[#0000EE]">{stat.val}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeIn} className="bg-slate-50 rounded-[2.5rem] p-12 aspect-[4/3] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0000EE]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <PhoneCall className="w-24 h-24 text-[#0000EE] opacity-20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intelligence & Summary */}
      <section className="py-24 bg-[#F9F9FB] border-y border-slate-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeIn} className="order-2 lg:order-1 bg-white rounded-[2.5rem] p-12 shadow-sm aspect-[4/3] flex flex-col justify-center">
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-[#0000EE]" /></div>
                    <div className="h-2 bg-slate-100 rounded-full flex-1" style={{ width: `${100 - (i * 15)}%` }} />
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeIn} className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center px-2 py-0.5 bg-purple-100 text-purple-600 rounded text-[10px] font-black uppercase tracking-wider">AI Intelligence</div>
              <h2 className="text-[32px] md:text-[44px] font-black text-[#111] leading-[1.1] tracking-tighter">Post-call work <br /> done in seconds.</h2>
              <p className="text-[15px] text-slate-500 font-medium leading-relaxed max-w-md">AI automatically summarizes every call, identifies next steps, and updates your CRM fields without any manual entry.</p>
              <ul className="space-y-3">
                {["Sentiment scoring", "Topic categorization", "Action item extraction"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[13px] font-bold text-slate-600">
                    <div className="w-1 h-1 rounded-full bg-[#0000EE]" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integration Wall */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div {...fadeIn} className="space-y-6">
            <h2 className="text-[32px] md:text-[48px] font-black text-[#111] leading-[1.1] tracking-tighter">Plugs into your <br /> existing tech stack.</h2>
            <p className="text-[15px] text-slate-500 font-medium leading-relaxed max-w-xl mx-auto">Native integrations with major CRM and commerce tools.</p>
            <div className="flex flex-wrap justify-center gap-8 pt-12">
               {['Salesforce', 'HubSpot', 'Shopify', 'Klaviyo', 'Zendesk', 'Slack'].map((integration, i) => (
                 <div key={i} className="px-6 py-3 bg-slate-50 rounded-xl text-[12px] font-black text-slate-400 tracking-widest">{integration}</div>
               ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-32 bg-[#F9F9FB]">
         <motion.div 
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto px-6 text-center"
         >
            <motion.div variants={fadeIn} className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-600 rounded-lg text-[11px] font-black uppercase tracking-wider mb-8">Case Studies</motion.div>
            <motion.h2 variants={fadeIn} className="text-[44px] font-bold text-[#111] mb-20 leading-tight tracking-tight">Real results from <br /> top commerce teams</motion.h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
               {[
                 { brand: "Polysleep", result: "45%", label: "Conversion lift", desc: "By using the dialer for abandoned checkouts." },
                 { brand: "Michael Todd", result: "2.5x", label: "Agent efficiency", desc: "Automating post-call notes and CRM sync." },
                 { brand: "Jaxxon", result: "12min", label: "Avg saved per agent", desc: "Every hour by eliminating manual dialing." }
               ].map((c, i) => (
                 <motion.div key={i} variants={fadeIn}>
                   <Card className="bg-white border-none rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-between h-full hover:shadow-xl transition-all">
                      <div>
                         <div className="text-[13px] font-black text-[#111] mb-8 uppercase tracking-widest">{c.brand}</div>
                         <div className="text-[56px] font-black text-[#0000EE] leading-none mb-2">{c.result}</div>
                         <div className="text-[15px] font-bold text-[#111] mb-4">{c.label}</div>
                         <p className="text-sm text-slate-400 font-medium leading-relaxed">{c.desc}</p>
                      </div>
                   </Card>
                 </motion.div>
               ))}
            </div>
         </motion.div>
      </section>

      {/* Global Scale */}
      <section className="py-24 bg-white">
        <motion.div 
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6 text-center"
        >
           <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black text-[#111] mb-20 tracking-tight">Built for global scale</motion.h2>
           <div className="grid md:grid-cols-4 gap-12">
              {[
                { label: "Uptime", val: "99.99%", desc: "Enterprise SLA", icon: Activity },
                { label: "Countries", val: "190+", desc: "Local numbers", icon: Globe },
                { label: "Security", val: "SOC 2", desc: "Certified infra", icon: ShieldCheck },
                { label: "Latency", val: "< 50ms", desc: "Edge network", icon: Zap }
              ].map((s, i) => (
                <motion.div key={i} variants={fadeIn} className="space-y-4">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <s.icon className="w-5 h-5 text-[#0000EE]" />
                   </div>
                   <div className="text-3xl font-black text-[#111]">{s.val}</div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-[#0000EE]">{s.label}</div>
                   <p className="text-xs text-slate-400 font-bold">{s.desc}</p>
                </motion.div>
              ))}
           </div>
        </motion.div>
      </section>

      <section className="py-32 bg-white text-center border-t border-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto px-6 space-y-10"
        >
          <h2 className="text-[52px] md:text-[72px] font-black text-[#111] tracking-tighter leading-none">Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0000EE] to-[#E1B2FF]">grow?</span></h2>
          <p className="text-xl text-slate-400 font-medium">Join the high-performing revenue teams scaling with Closo.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button size="lg" className="bg-[#111] text-white px-10 h-14 text-sm font-bold rounded-2xl shadow-xl transition-all hover:scale-105" onClick={() => window.location.href='/dashboard'}>Start for free</Button>
             <Button variant="outline" size="lg" className="px-10 h-14 text-sm border-slate-200 text-[#111] bg-white rounded-2xl transition-all hover:scale-105" onClick={() => setLocation("/demo")}>Talk to sales</Button>
          </div>
        </motion.div>
      </section>

      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed bottom-6 right-6 z-[100]"
      >
        <div className="bg-white p-1.5 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-[10px]">💬</div>
          <div className="bg-[#111] text-white px-3 py-2 rounded-xl flex items-center gap-2 text-[12px] font-bold"><PhoneCall className="w-3.5 h-3.5" />Start call</div>
        </div>
      </motion.div>

      <EnterpriseFooter />
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
