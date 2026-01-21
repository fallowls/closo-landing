import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PhoneCall,
  Users,
  Zap,
  ArrowRight,
  ChevronRight,
  Code,
  Globe,
  CheckCircle2,
  Search,
  Layers,
  ShieldCheck,
  MessageSquare,
  ArrowUpRight,
  Database,
  BarChart3,
  Target,
  Sparkles,
  PhoneForwarded,
  LayoutDashboard
} from "lucide-react";
import { useLocation, Link } from "wouter";
import closoLogo from "@assets/closo_logo_png_1768558486274.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";
import { SEO } from "@/components/SEO";

export default function Landing() {
  const [showHeader, setShowHeader] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-[#0000EE] selection:bg-[#E1B2FF]/30 font-sans tracking-tight">
      <SEO 
        title="Closo | Comprehensive Sales Intelligence & Dialing Platform" 
        description="The all-in-one phone platform for high-growth subscription businesses. Parallel dialing, integrated CRM, and advanced contact management."
      />
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: `radial-gradient(#0000EE 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} 
      />

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showHeader ? 'py-2 border-b border-[#0000EE]/5 bg-white/80 backdrop-blur-md' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/"><img src={closoLogo} alt="Closo" className="h-6 cursor-pointer" /></Link>
            <div className="hidden lg:flex items-center gap-8">
              {['Features', 'Solutions', 'Pricing', 'Resources'].map(item => (
                <span key={item} className="text-[15px] font-medium text-slate-600 hover:text-[#0000EE] cursor-pointer transition-colors">{item}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[15px] font-medium text-slate-600 hover:text-[#0000EE]">Log in</Link>
            <Button className="bg-[#111] hover:bg-black text-white px-5 h-10 text-[15px] font-medium rounded-lg" onClick={() => window.location.href='/dashboard'}>Book a demo</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="relative w-56 h-56 mx-auto mb-12">
            <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-white shadow-2xl z-20">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" alt="Hero" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -left-16 top-1/4 bg-white p-3 rounded-xl shadow-xl border border-slate-100 z-30 animate-bounce-slow">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Connect</span>
              </div>
              <div className="text-xl font-black text-[#111]">$18.6k</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Revenue Generated</div>
            </div>
            <div className="absolute -right-20 bottom-1/4 bg-white p-3 rounded-xl shadow-xl border border-slate-100 z-30 animate-float">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-[#E1B2FF] flex items-center justify-center text-xs font-bold text-white">CH</div>
                 <div className="text-left">
                   <div className="text-[11px] font-bold text-[#111]">Charlie H.</div>
                   <div className="text-[9px] text-slate-400 font-black uppercase">Active Dialing</div>
                 </div>
               </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm text-[12px] font-medium text-slate-600 mb-8">
            <span className="text-rose-500">📣</span>
            <span className="font-bold">Closo Series A: $3.3M Raised</span>
            <Link href="/blog" className="flex items-center gap-1 ml-2 text-slate-400 hover:text-[#0000EE] border-l pl-2">Read Announcement <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
          
          <h1 className="text-6xl md:text-[88px] font-bold tracking-tight mb-8 leading-[1.05] text-[#111] max-w-4xl mx-auto">
            The phone platform for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E1B2FF] to-[#0000EE]">hyper-growth</span>
          </h1>
          
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Drive new sales and discover unique insights by engaging with your customers profitably on the phone. Built for high-volume outreach and subscription revenue.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button size="lg" className="bg-[#111] hover:bg-black text-white px-10 h-14 text-base font-bold rounded-xl shadow-2xl hover:-translate-y-1 transition-all" onClick={() => window.location.href='/dashboard'}>Get Started Free</Button>
            <Button variant="outline" size="lg" className="px-10 h-14 text-base border-slate-200 text-[#111] bg-white rounded-xl hover:bg-slate-50 hover:-translate-y-1 transition-all">Book a Demo</Button>
          </div>

          <div className="pt-12 border-t border-slate-100">
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-12">Trusted by revenue teams at</p>
            <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              {['KALA', 'routine', 'EVOLV', 'diyversify', 'MENE', 'medterra', 'QUICK'].map(brand => (
                <div key={brand} className="text-2xl font-black text-slate-900 tracking-tighter">{brand}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parallel Dialer Deep Dive */}
      <section className="py-32 bg-white relative overflow-hidden border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E1B2FF]/10 text-[#E1B2FF] rounded-lg text-[12px] font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>Performance</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#111] leading-[1.1]">
                Scale outreach 10x with <br /> <span className="text-[#0000EE]">Parallel Dialing</span>
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                Dial up to 10 lines simultaneously and connect instantly when a prospect answers. Spend 80% of your time talking, not waiting for rings.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: "Zero Latency", desc: "Instant handoff when picked up." },
                  { title: "AI VM Detection", desc: "99.9% accuracy in skipping voicemails." },
                  { title: "Live Monitoring", desc: "Whisper or join calls in real-time." },
                  { title: "Call Recording", desc: "Automatic HD storage and sync." }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="font-bold text-[#111] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0000EE]" /> {item.title}
                    </h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-[#0000EE]/5 rounded-[3rem] blur-3xl opacity-50 translate-x-10 translate-y-10 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-[#111] rounded-[2.5rem] p-8 shadow-2xl border border-white/10">
                 {/* Dialer Interface Mock */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-center text-white">
                       <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
                          <span className="text-xs font-black uppercase tracking-widest">Active Session</span>
                       </div>
                       <div className="text-xs font-bold text-slate-400">8 lines active</div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                       {[1,2,3,4,5,6,7,8].map(l => (
                         <div key={l} className={`h-12 rounded-xl border border-white/10 flex items-center justify-center transition-all ${l === 3 ? 'bg-[#0000EE] border-[#0000EE] shadow-[0_0_20px_rgba(0,0,EE,0.4)]' : 'bg-white/5'}`}>
                            <Users className={`w-4 h-4 ${l === 3 ? 'text-white' : 'text-slate-600'}`} />
                         </div>
                       ))}
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                       <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-black text-slate-500 uppercase">Live Connection</span>
                          <span className="text-[10px] font-bold text-emerald-400">03:42</span>
                       </div>
                       <div className="text-sm font-bold text-white mb-1">Sarah Jenkins</div>
                       <div className="text-[10px] text-slate-400 uppercase font-black">Head of Sales @ TechFlow</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sales CRM Section */}
      <section className="py-32 bg-[#F9F9FB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1 relative">
               <div className="absolute inset-0 bg-[#E1B2FF]/10 rounded-full blur-[100px] opacity-30" />
               <Card className="relative bg-white border-slate-100 shadow-2xl rounded-[2.5rem] p-10 overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-lg font-black text-[#111] uppercase tracking-tight">Lead Pipeline</h3>
                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><LayoutDashboard className="w-4 h-4 text-slate-400" /></Button>
                  </div>
                  <div className="space-y-4">
                     {[
                       { name: "Acme Corp", stage: "Discovery", score: 98, color: "bg-emerald-500" },
                       { name: "Global Tech", stage: "Negotiation", score: 92, color: "bg-blue-500" },
                       { name: "Skyline Inc", stage: "Outreach", score: 85, color: "bg-purple-500" },
                       { name: "Vertex Co", stage: "Discovery", score: 76, color: "bg-amber-500" }
                     ].map((lead, i) => (
                       <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className={`w-2 h-10 rounded-full ${lead.color}`} />
                             <div>
                                <div className="text-sm font-bold text-[#111]">{lead.name}</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase">{lead.stage}</div>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="text-sm font-black text-[#0000EE]">{lead.score}</div>
                             <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Lead Score</div>
                          </div>
                       </div>
                     ))}
                  </div>
               </Card>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0000EE]/10 text-[#0000EE] rounded-lg text-[12px] font-bold uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>Growth</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#111] leading-[1.1]">
                Integrated <span className="text-[#E1B2FF]">Sales CRM</span> <br /> that works for you
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                Stop jumping between tools. Closo's built-in CRM tracks every lead, interaction, and deal stage automatically. 
              </p>
              <ul className="space-y-4">
                {[
                  "Automatic lead scoring based on intent data.",
                  "Two-way sync with Salesforce & HubSpot.",
                  "Visual pipeline management with drag-and-drop.",
                  "Smart follow-up reminders powered by AI."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E1B2FF]/20 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-3 h-3 text-[#E1B2FF]" />
                    </div>
                    <span className="text-slate-600 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-[#111] text-white px-8 h-14 rounded-xl font-bold shadow-xl hover:-translate-y-1 transition-all">Explore CRM Features</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Management Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[12px] font-bold uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>Intelligence</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#111] leading-[1.1]">
                Advanced <span className="text-emerald-500">Contact</span> <br /> Management
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                Access a database of 250M+ verified professionals with real-time enrichment. Find the right decision-makers in seconds.
              </p>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { icon: Database, title: "250M+", label: "Verified Contacts" },
                   { icon: Search, title: "Real-time", label: "Enrichment" },
                   { icon: Globe, title: "Global", label: "Business Data" },
                   { icon: ShieldCheck, title: "GDPR", label: "Compliant" }
                 ].map((stat, i) => (
                   <div key={i} className="p-5 rounded-2xl bg-[#F9F9FB] border border-slate-100">
                      <stat.icon className="w-5 h-5 text-emerald-500 mb-3" />
                      <div className="text-xl font-black text-[#111]">{stat.title}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                   </div>
                 ))}
              </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-[120px] opacity-30 translate-x-1/4" />
               <div className="relative bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8">
                  {/* Contact Card Mock */}
                  <div className="space-y-6">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-[#111] flex items-center justify-center text-white text-2xl font-black shadow-xl">AM</div>
                        <div>
                           <div className="text-xl font-black text-[#111]">Alex Marshall</div>
                           <div className="text-sm font-bold text-slate-400">CTO @ InnovateX</div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-600 flex items-center gap-2">
                           <MessageSquare className="w-3 h-3 text-[#0000EE]" /> alex@innovatex.com
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-600 flex items-center gap-2">
                           <PhoneCall className="w-3 h-3 text-emerald-500" /> +1 (555) 123-4567
                        </div>
                     </div>
                     <div className="pt-4 border-t border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Skills & Attributes</div>
                        <div className="flex flex-wrap gap-2">
                           {["B2B SaaS", "Decision Maker", "Cloud Infra", "Series B"].map(tag => (
                             <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">{tag}</span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Infrastructure Section */}
      <section className="py-32 bg-[#111] text-white overflow-hidden relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mb-20">
             <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Built for scale. <br /> Built for speed.</h2>
             <p className="text-xl text-slate-400 font-medium">Handling millions of interactions globally with military-grade security and sub-millisecond latency.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "HD Voice", val: "Crystal Clear", desc: "Opus variable bitrate", icon: Volume2 },
              { title: "Uptime", val: "99.99%", desc: "Enterprise SLA", icon: Wifi },
              { title: "Encryption", val: "AES-256", desc: "End-to-end security", icon: Lock },
              { title: "Global Numbers", val: "190+", desc: "Local presence", icon: Globe }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                <item.icon className="w-6 h-6 text-[#E1B2FF] mb-6 group-hover:scale-110 transition-transform" />
                <div className="text-xl font-bold mb-1">{item.val}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#E1B2FF] mb-2">{item.title}</div>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10">
          <h2 className="text-5xl md:text-8xl font-black text-[#111] tracking-tighter leading-none">Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0000EE] to-[#E1B2FF]">dominate?</span></h2>
          <p className="text-2xl text-slate-500 font-medium">Join the high-performing revenue teams scaling with Closo.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Button size="lg" className="bg-[#111] hover:bg-black text-white px-12 h-16 text-lg font-black rounded-2xl transition-all shadow-2xl hover:scale-105" onClick={() => window.location.href='/dashboard'}>Get Started Now</Button>
             <Button variant="outline" size="lg" className="px-12 h-16 text-lg border-slate-200 text-[#111] bg-white hover:bg-slate-50 rounded-2xl transition-all hover:scale-105" onClick={() => setLocation("/demo")}>Talk to Sales</Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#E1B2FF] via-[#0000EE] to-[#E1B2FF] opacity-30" />
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-[100] group">
        <div className="bg-white p-2 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#E1B2FF]/20 flex items-center justify-center">
             <MessageSquare className="w-5 h-5 text-[#E1B2FF]" />
          </div>
          <div className="bg-[#111] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-[14px] font-bold">
            <PhoneCall className="w-4 h-4" />
            Launch Dialer
          </div>
        </div>
      </div>

      <EnterpriseFooter />

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
