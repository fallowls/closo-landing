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
    <div className="min-h-screen bg-white text-[#111] selection:bg-[#E1B2FF]/30 font-sans tracking-tight overflow-x-hidden">
      <SEO 
        title="Closo | The phone platform for B2B commerce" 
        description="Drive new sales and discover unique insights by engaging with your customers profitably on the phone."
      />
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: `radial-gradient(#111 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} 
      />

      <div className={`fixed top-4 left-0 right-0 z-50 flex justify-center transition-all duration-300`}>
        <nav className={`flex items-center justify-between px-6 py-2 rounded-xl border transition-all duration-300 shadow-sm ${showHeader ? 'bg-white/90 backdrop-blur-md border-slate-200 w-[1000px]' : 'bg-white/40 backdrop-blur-sm border-slate-100 w-[1100px]'}`}>
          <div className="flex items-center gap-10">
            <Link href="/"><img src={closoLogo} alt="Closo" className="h-4 cursor-pointer" /></Link>
            <div className="hidden lg:flex items-center gap-6">
              {['Product', 'Resources', 'Pricing'].map(item => (
                <div key={item} className="flex items-center gap-1 cursor-pointer group">
                  <span className="text-[13px] font-medium text-slate-600 group-hover:text-[#111] transition-colors">{item}</span>
                  <ChevronRight className="w-3 h-3 rotate-90 text-slate-300" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-[13px] font-medium text-slate-600 hover:text-[#111]">Log in</Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-[13px] font-medium hover:bg-slate-50 px-3 h-8 rounded-lg border border-slate-100">Sign up free</Button>
              <Button className="bg-[#111] hover:bg-black text-white px-4 h-8 text-[13px] font-medium rounded-lg shadow-sm" onClick={() => window.location.href='/dashboard'}>Book a demo</Button>
            </div>
          </div>
        </nav>
      </div>

      <section className="relative pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="relative w-[300px] h-[300px] mx-auto mb-12">
            <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-white shadow-xl z-10">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" alt="Hero" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -left-8 top-1/4 bg-white p-2 rounded-lg shadow-xl border border-slate-50 z-20 animate-bounce-slow">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Voicemail dropped</span>
              </div>
              <div className="text-lg font-black text-[#111] tracking-tight">$18,600</div>
              <div className="text-[8px] text-slate-400 font-bold">Total revenue</div>
            </div>
            <div className="absolute -right-12 top-1/2 bg-white p-2 rounded-lg shadow-xl border border-slate-50 z-20 animate-float">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">CH</div>
                 <div className="text-left">
                   <div className="text-[10px] font-bold text-[#111]">Charlie Hawkins</div>
                   <div className="flex gap-1 mt-0.5">
                      <div className="px-1.5 py-0.5 bg-[#E1B2FF]/20 text-[#E1B2FF] rounded text-[7px] font-black uppercase tracking-wider">In progress</div>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-100 shadow-sm text-[11px] font-medium text-slate-600 mb-8">
            <span className="text-[#0000EE]">📣</span>
            <span className="font-semibold">Closo raises $3.3M</span>
            <Link href="/blog" className="flex items-center gap-1 ml-1 text-slate-400 border-l pl-2 border-slate-200">Read <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
          
          <h1 className="text-[48px] md:text-[68px] font-bold tracking-tight mb-8 leading-[1.1] text-[#111] max-w-3xl mx-auto">
            The phone platform for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E1B2FF] to-[#0000EE]">B2B commerce</span>
          </h1>
          
          <p className="text-[18px] text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
            Drive new sales and discover unique insights by engaging with your customers profitably on the phone.
          </p>
          
          <div className="flex gap-3 justify-center mb-20">
            <Button size="lg" className="bg-[#111] hover:bg-black text-white px-8 h-12 text-sm font-bold rounded-xl" onClick={() => window.location.href='/dashboard'}>Start for free</Button>
            <Button variant="outline" size="lg" className="px-8 h-12 text-sm border-slate-200 text-[#111] bg-white rounded-xl">Book a demo</Button>
          </div>

          <div className="pt-10 border-t border-slate-100 flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale">
            {['MICHAEL TODD', 'Polysleep', 'JAXXON', 'BATTLEX', 'H-ARNY', 'Audien Hearing', 'Z-Link'].map(brand => (
              <div key={brand} className="text-xl font-bold text-[#111]">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
           <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold mb-6">Introducing Closo</div>
           <h2 className="text-[36px] md:text-[48px] font-bold text-[#111] mb-4 leading-tight tracking-tight">A voice platform <br /> built for growth</h2>
           <p className="text-[17px] text-slate-500 mb-16 max-w-xl mx-auto">Everything you need to turn phone calls into revenue.</p>
           
           <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Power Dialer", icon: PhoneCall, color: "text-purple-500", bg: "bg-purple-50", desc: "Scale outbound without manual dialing." },
                { title: "Voice Agents", icon: Mic, color: "text-rose-500", bg: "bg-rose-50", desc: "Automate intake and qualification." },
                { title: "Phone Hub", icon: Layers, color: "text-amber-500", bg: "bg-amber-50", desc: "Sync all call data to your CRM." }
              ].map((item, i) => (
                <Card key={i} className="bg-[#F9F9FB] border-none rounded-[2rem] p-8 text-left hover:shadow-lg transition-all cursor-pointer">
                   <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-5`}><item.icon className={`w-6 h-6 ${item.color}`} /></div>
                   <h3 className="text-xl font-bold text-[#111] mb-2">{item.title}</h3>
                   <p className="text-sm text-slate-400 font-medium">{item.desc}</p>
                </Card>
              ))}
           </div>
        </div>
      </section>

      {/* Outbound Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-[11px] font-black uppercase tracking-wider">Outbound Phone</div>
            <h2 className="text-[44px] font-bold text-[#111] leading-tight tracking-tight">Add a new <br /> sales channel</h2>
            <ul className="space-y-4 text-[17px] text-slate-600 font-medium">
               <li className="flex gap-2"><span className="text-purple-500 font-bold">•</span><span>Call shoppers at the perfect moment based on intent.</span></li>
               <li className="flex gap-2"><span className="text-purple-500 font-bold">•</span><span>Automatically drop personalized voicemails to missed calls.</span></li>
               <li className="flex gap-2"><span className="text-purple-500 font-bold">•</span><span>Run campaigns on high-value segments like abandoned carts.</span></li>
            </ul>
            <Button className="bg-[#111] text-white px-8 h-12 rounded-xl font-bold text-sm shadow-lg">Tour the platform</Button>
          </div>
          <div className="relative bg-[#E1B2FF]/10 rounded-[3rem] p-10">
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
               <div className="absolute -top-10 -left-16 bg-white rounded-2xl shadow-xl border border-slate-50 p-8 w-64 animate-float">
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
               </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Intelligence Section */}
      <section className="py-24 bg-[#F9F9FB] border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
             <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BarChart3, label: "Sentiment", val: "Positive", color: "text-emerald-500" },
                  { icon: MousePointer2, label: "Intent", val: "High", color: "text-[#0000EE]" },
                  { icon: Headphones, label: "Topic", val: "Pricing", color: "text-purple-500" },
                  { icon: Database, label: "Sync", val: "Live", color: "text-rose-500" }
                ].map((f, i) => (
                  <Card key={i} className="bg-white border-none rounded-3xl p-6 shadow-sm">
                     <f.icon className={`w-5 h-5 ${f.color} mb-3`} />
                     <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{f.label}</div>
                     <div className="text-lg font-black text-[#111]">{f.val}</div>
                  </Card>
                ))}
             </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
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
          </div>
        </div>
      </section>

      {/* New Section: Automation & Workflow */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
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
          </div>
          <div className="relative">
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
          </div>
        </div>
      </section>

      {/* New Section: Testimonials/Results */}
      <section className="py-32 bg-[#F9F9FB]">
         <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-600 rounded-lg text-[11px] font-black uppercase tracking-wider mb-8">Case Studies</div>
            <h2 className="text-[44px] font-bold text-[#111] mb-20 leading-tight tracking-tight">Real results from <br /> top commerce teams</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
               {[
                 { brand: "Polysleep", result: "45%", label: "Conversion lift", desc: "By using the dialer for abandoned checkouts." },
                 { brand: "Michael Todd", result: "2.5x", label: "Agent efficiency", desc: "Automating post-call notes and CRM sync." },
                 { brand: "Jaxxon", result: "12min", label: "Avg saved per agent", desc: "Every hour by eliminating manual dialing." }
               ].map((c, i) => (
                 <Card key={i} className="bg-white border-none rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-between h-full">
                    <div>
                       <div className="text-[13px] font-black text-[#111] mb-8 uppercase tracking-widest">{c.brand}</div>
                       <div className="text-[56px] font-black text-[#0000EE] leading-none mb-2">{c.result}</div>
                       <div className="text-[15px] font-bold text-[#111] mb-4">{c.label}</div>
                       <p className="text-sm text-slate-400 font-medium leading-relaxed">{c.desc}</p>
                    </div>
                 </Card>
               ))}
            </div>
         </div>
      </section>

      {/* Global Scale Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <h2 className="text-4xl md:text-5xl font-black text-[#111] mb-20 tracking-tight">Built for global scale</h2>
           <div className="grid md:grid-cols-4 gap-12">
              {[
                { label: "Uptime", val: "99.99%", desc: "Enterprise SLA", icon: Activity },
                { label: "Countries", val: "190+", desc: "Local numbers", icon: Globe },
                { label: "Security", val: "SOC 2", desc: "Certified infra", icon: ShieldCheck },
                { label: "Latency", val: "< 50ms", desc: "Edge network", icon: Zap }
              ].map((s, i) => (
                <div key={i} className="space-y-4">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <s.icon className="w-5 h-5 text-[#0000EE]" />
                   </div>
                   <div className="text-3xl font-black text-[#111]">{s.val}</div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-[#0000EE]">{s.label}</div>
                   <p className="text-xs text-slate-400 font-bold">{s.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      <section className="py-32 bg-white text-center border-t border-slate-50">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <h2 className="text-[52px] md:text-[72px] font-black text-[#111] tracking-tighter leading-none">Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0000EE] to-[#E1B2FF]">grow?</span></h2>
          <p className="text-xl text-slate-400 font-medium">Join the high-performing revenue teams scaling with Closo.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button size="lg" className="bg-[#111] text-white px-10 h-14 text-sm font-bold rounded-2xl shadow-xl transition-all hover:scale-105" onClick={() => window.location.href='/dashboard'}>Start for free</Button>
             <Button variant="outline" size="lg" className="px-10 h-14 text-sm border-slate-200 text-[#111] bg-white rounded-2xl transition-all hover:scale-105" onClick={() => setLocation("/demo")}>Talk to sales</Button>
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-[100]">
        <div className="bg-white p-1.5 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-[10px]">💬</div>
          <div className="bg-[#111] text-white px-3 py-2 rounded-xl flex items-center gap-2 text-[12px] font-bold"><PhoneCall className="w-3.5 h-3.5" />Start call</div>
        </div>
      </div>

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
