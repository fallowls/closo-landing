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
  Activity
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
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: `radial-gradient(#111 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} 
      />

      {/* New Redesigned Header - Centered & Compact Consio Style */}
      <div className={`fixed top-4 left-0 right-0 z-50 flex justify-center transition-all duration-500`}>
        <nav className={`flex items-center justify-between px-6 py-2 rounded-2xl border transition-all duration-500 shadow-sm ${showHeader ? 'bg-white/90 backdrop-blur-md border-slate-200 w-[1150px]' : 'bg-white/40 backdrop-blur-sm border-slate-100 w-[1200px]'}`}>
          <div className="flex items-center gap-12">
            <Link href="/"><img src={closoLogo} alt="Closo" className="h-5 cursor-pointer" /></Link>
            <div className="hidden lg:flex items-center gap-8">
              {['Product', 'Resources', 'Customers', 'Pricing'].map(item => (
                <div key={item} className="flex items-center gap-1 cursor-pointer group">
                  <span className="text-[14px] font-medium text-slate-600 group-hover:text-[#111] transition-colors">{item}</span>
                  <ChevronRight className="w-3 h-3 rotate-90 text-slate-300" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[14px] font-medium text-slate-600 hover:text-[#111]">Log in</Link>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-[14px] font-medium hover:bg-slate-50 px-4 h-9 rounded-lg border border-slate-100">Sign up free</Button>
              <Button className="bg-[#111] hover:bg-black text-white px-5 h-9 text-[14px] font-medium rounded-lg shadow-sm" onClick={() => window.location.href='/dashboard'}>Book a demo</Button>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative pt-44 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="relative w-[340px] h-[340px] mx-auto mb-10">
            <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-2xl z-10">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" alt="Hero" className="w-full h-full object-cover" />
            </div>
            {/* Floating Elements */}
            <div className="absolute -left-12 top-1/4 bg-white p-3 rounded-xl shadow-2xl border border-slate-50 z-20 animate-bounce-slow">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Voicemail dropped</span>
              </div>
              <div className="text-xl font-black text-[#111] tracking-tight">$18,600</div>
              <div className="text-[9px] text-slate-400 font-bold mt-1">Total revenue</div>
            </div>
            <div className="absolute -right-16 top-1/2 bg-white p-3 rounded-xl shadow-2xl border border-slate-50 z-20 animate-float">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">CH</div>
                 <div className="text-left">
                   <div className="text-[11px] font-bold text-[#111]">Charlie Hawkins • 1st call</div>
                   <div className="flex gap-1 mt-1">
                      <div className="px-2 py-0.5 bg-[#E1B2FF]/20 text-[#E1B2FF] rounded text-[8px] font-black uppercase tracking-wider">Call in progress</div>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm text-[12px] font-medium text-slate-600 mb-10">
            <span className="text-[#0000EE]">📣</span>
            <span className="font-semibold">Closo raises $3.3M</span>
            <Link href="/blog" className="flex items-center gap-1 ml-2 text-slate-400 hover:text-[#111] border-l pl-2 border-slate-200">
              Read <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          
          <h1 className="text-[56px] md:text-[80px] font-bold tracking-tight mb-8 leading-[1.05] text-[#111] max-w-4xl mx-auto">
            The phone platform for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E1B2FF] to-[#0000EE]">B2B commerce</span>
          </h1>
          
          <p className="text-[20px] text-slate-500 mb-12 max-w-xl mx-auto leading-relaxed font-normal">
            Drive new sales and discover unique insights by engaging with your customers profitably on the phone.
          </p>
          
          <div className="flex gap-4 justify-center mb-24">
            <Button size="lg" className="bg-[#111] hover:bg-black text-white px-10 h-14 text-base font-bold rounded-xl shadow-lg" onClick={() => window.location.href='/dashboard'}>Start for free</Button>
            <Button variant="outline" size="lg" className="px-10 h-14 text-base border-slate-200 text-[#111] bg-white hover:bg-slate-50 rounded-xl">Book a demo</Button>
          </div>

          <div className="pt-12 border-t border-slate-100">
            <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-12">Powering revenue-driving phone sales for</p>
            <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              {['MICHAEL TODD', 'Polysleep', 'JAXXON', 'BATTLEX', 'H-ARNY', 'Audien Hearing'].map(brand => (
                <div key={brand} className="text-xl font-bold text-[#111] tracking-tighter">{brand}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
           <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[12px] font-bold mb-8">
             Introducing Closo
           </div>
           <h2 className="text-[48px] md:text-[64px] font-bold text-[#111] mb-6 leading-tight tracking-tight">A voice platform <br /> built for growth</h2>
           <p className="text-[20px] text-slate-500 mb-20 max-w-2xl mx-auto leading-relaxed">Everything you need to turn phone calls into revenue, natively integrated with your business stack.</p>
           
           <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Ecom Power Dialer", icon: PhoneCall, color: "text-purple-500", bg: "bg-purple-50" },
                { title: "AI Voice Agents", icon: Mic, color: "text-rose-500", bg: "bg-rose-50" },
                { title: "AI Phone Hub", icon: Layers, color: "text-amber-500", bg: "bg-amber-50" }
              ].map((item, i) => (
                <Card key={i} className="bg-[#F9F9FB] border-none rounded-[2.5rem] p-10 text-left hover:shadow-xl transition-all group cursor-pointer">
                   <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-8 h-8 ${item.color}`} />
                   </div>
                   <h3 className="text-2xl font-bold text-[#111] tracking-tight">{item.title}</h3>
                </Card>
              ))}
           </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-[12px] font-black uppercase tracking-wider">
              Ecommerce Power Dialer
            </div>
            <h2 className="text-[52px] font-bold text-[#111] leading-[1.1] tracking-tight">Add a new <br /> sales channel: <br /> Outbound Phone</h2>
            <ul className="space-y-6 text-[18px] text-slate-600 font-medium leading-relaxed">
               <li className="flex gap-3">
                 <span className="text-purple-500 font-bold">•</span>
                 <span>Call shoppers at the perfect moment to drive conversions.</span>
               </li>
               <li className="flex gap-3">
                 <span className="text-purple-500 font-bold">•</span>
                 <span>Automatically drop voicemails directly to their inbox.</span>
               </li>
               <li className="flex gap-3">
                 <span className="text-purple-500 font-bold">•</span>
                 <span>Run campaigns on high-value segments like abandoned checkouts.</span>
               </li>
            </ul>
            <Button size="lg" className="bg-[#111] text-white px-10 h-16 rounded-2xl font-bold text-lg shadow-xl hover:-translate-y-1 transition-all">Tour the platform</Button>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-purple-200 rounded-[3rem] blur-[120px] opacity-20" />
             <div className="relative bg-[#E1B2FF]/20 rounded-[3.5rem] p-12">
                <Card className="bg-white rounded-[2.5rem] border-none shadow-2xl p-10 relative">
                   <div className="flex items-center gap-3 mb-10">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Call in progress (0:03)</span>
                   </div>
                   <div className="flex flex-col items-center mb-10">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 mb-6 shadow-xl">
                         <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" alt="Caller" />
                      </div>
                      <div className="text-2xl font-black text-[#111] tracking-tight">Charlie Hawkins</div>
                      <div className="text-base text-slate-400 font-medium">+1 (514) 257-8561</div>
                   </div>
                   <div className="flex gap-4">
                      <Button variant="outline" className="flex-1 h-14 rounded-2xl text-[15px] font-bold gap-3 border-slate-200">
                         <Volume2 className="w-5 h-5 text-slate-400" /> Drop voicemail
                      </Button>
                      <Button className="w-14 h-14 p-0 bg-rose-500 hover:bg-rose-600 rounded-2xl shadow-lg shadow-rose-200">
                         <PhoneCall className="w-6 h-6 text-white rotate-[135deg]" />
                      </Button>
                   </div>
                   
                   {/* Call List Overlay */}
                   <div className="absolute -top-12 -left-20 bg-white rounded-3xl shadow-2xl border border-slate-50 p-8 w-72 animate-float">
                      <div className="text-[15px] font-black text-[#111] mb-6 uppercase tracking-widest">Call list</div>
                      <div className="space-y-6">
                         {[
                           { name: "Oscar Reed", phone: "+1 (415) 985-6822", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" },
                           { name: "Fiona Clark", phone: "+1 (514) 869-5657", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" }
                         ].map((c, i) => (
                           <div key={i} className="flex items-center gap-4">
                              <img src={c.img} className="w-10 h-10 rounded-full border border-slate-100" alt="" />
                              <div>
                                 <div className="text-[13px] font-bold text-[#111] leading-none mb-1">{c.name}</div>
                                 <div className="text-[11px] text-slate-400 font-medium">{c.phone}</div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </Card>
             </div>
          </div>
        </div>
      </section>

      {/* Global Scale Section */}
      <section className="py-32 bg-[#F9F9FB] border-y border-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <h2 className="text-4xl md:text-5xl font-black text-[#111] mb-20 tracking-tight">Built for global scale</h2>
           <div className="grid md:grid-cols-4 gap-8">
              {[
                { label: "Uptime", val: "99.99%", desc: "Enterprise SLA", icon: Activity },
                { label: "Countries", val: "190+", desc: "Local numbers", icon: Globe },
                { label: "Security", val: "SOC 2", desc: "Certified infra", icon: ShieldCheck },
                { label: "Latency", val: "< 50ms", desc: "Edge network", icon: Zap }
              ].map((s, i) => (
                <div key={i} className="space-y-4">
                   <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                      <s.icon className="w-6 h-6 text-[#0000EE]" />
                   </div>
                   <div className="text-3xl font-black text-[#111]">{s.val}</div>
                   <div className="text-xs font-black uppercase tracking-widest text-[#0000EE]">{s.label}</div>
                   <p className="text-sm text-slate-400 font-medium">{s.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <h2 className="text-[56px] md:text-[88px] font-black text-[#111] tracking-tighter leading-none">Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0000EE] to-[#E1B2FF]">grow?</span></h2>
          <p className="text-2xl text-slate-500 font-medium">Join the high-performing revenue teams scaling with Closo.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Button size="lg" className="bg-[#111] hover:bg-black text-white px-12 h-16 text-lg font-black rounded-2xl transition-all shadow-2xl hover:scale-105" onClick={() => window.location.href='/dashboard'}>Start for free</Button>
             <Button variant="outline" size="lg" className="px-12 h-16 text-lg border-slate-200 text-[#111] bg-white hover:bg-slate-50 rounded-2xl transition-all hover:scale-105" onClick={() => setLocation("/demo")}>Talk to sales</Button>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <div className="bg-white p-2 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
             <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold">💬</div>
          </div>
          <div className="bg-[#111] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-[14px] font-bold">
            <PhoneCall className="w-4 h-4" />
            Start a call
          </div>
        </div>
      </div>

      <EnterpriseFooter />

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
