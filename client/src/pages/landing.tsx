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

      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="relative w-[280px] h-[280px] mx-auto mb-8">
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

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-100 shadow-sm text-[11px] font-medium text-slate-600 mb-6">
            <span className="text-[#0000EE]">📣</span>
            <span className="font-semibold">Closo raises $3.3M</span>
            <Link href="/blog" className="flex items-center gap-1 ml-1 text-slate-400 border-l pl-2 border-slate-200">Read <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
          
          <h1 className="text-[48px] md:text-[64px] font-bold tracking-tight mb-6 leading-[1.1] text-[#111] max-w-3xl mx-auto">
            The phone platform for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E1B2FF] to-[#0000EE]">B2B commerce</span>
          </h1>
          
          <p className="text-[17px] text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
            Drive new sales and discover unique insights by engaging with your customers profitably on the phone.
          </p>
          
          <div className="flex gap-3 justify-center mb-16">
            <Button size="lg" className="bg-[#111] hover:bg-black text-white px-8 h-12 text-sm font-bold rounded-xl" onClick={() => window.location.href='/dashboard'}>Start for free</Button>
            <Button variant="outline" size="lg" className="px-8 h-12 text-sm border-slate-200 text-[#111] bg-white rounded-xl">Book a demo</Button>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-wrap justify-center items-center gap-x-10 gap-y-6 opacity-40 grayscale">
            {['MICHAEL TODD', 'Polysleep', 'JAXXON', 'BATTLEX', 'H-ARNY'].map(brand => (
              <div key={brand} className="text-lg font-bold text-[#111]">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
           <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold mb-6">Introducing Closo</div>
           <h2 className="text-[36px] md:text-[48px] font-bold text-[#111] mb-4 leading-tight tracking-tight">A voice platform <br /> built for growth</h2>
           <p className="text-[17px] text-slate-500 mb-12 max-w-xl mx-auto">Everything you need to turn phone calls into revenue.</p>
           
           <div className="grid md:grid-cols-3 gap-5">
              {[
                { title: "Power Dialer", icon: PhoneCall, color: "text-purple-500", bg: "bg-purple-50" },
                { title: "Voice Agents", icon: Mic, color: "text-rose-500", bg: "bg-rose-50" },
                { title: "Phone Hub", icon: Layers, color: "text-amber-500", bg: "bg-amber-50" }
              ].map((item, i) => (
                <Card key={i} className="bg-[#F9F9FB] border-none rounded-[2rem] p-8 text-left hover:shadow-lg transition-all cursor-pointer">
                   <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-5`}><item.icon className={`w-6 h-6 ${item.color}`} /></div>
                   <h3 className="text-xl font-bold text-[#111]">{item.title}</h3>
                </Card>
              ))}
           </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-[11px] font-black uppercase tracking-wider">Outbound Phone</div>
            <h2 className="text-[40px] font-bold text-[#111] leading-tight tracking-tight">Add a new <br /> sales channel</h2>
            <ul className="space-y-4 text-[16px] text-slate-600 font-medium">
               <li className="flex gap-2"><span className="text-purple-500">•</span><span>Call shoppers at the perfect moment.</span></li>
               <li className="flex gap-2"><span className="text-purple-500">•</span><span>Automatically drop voicemails.</span></li>
               <li className="flex gap-2"><span className="text-purple-500">•</span><span>Run campaigns on high-value segments.</span></li>
            </ul>
            <Button className="bg-[#111] text-white px-6 h-12 rounded-xl font-bold">Tour platform</Button>
          </div>
          <div className="relative bg-[#E1B2FF]/10 rounded-[2.5rem] p-8">
            <Card className="bg-white rounded-[2rem] border-none shadow-xl p-8 relative">
               <div className="flex items-center gap-2 mb-8">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Call in progress (0:03)</span>
               </div>
               <div className="flex flex-col items-center mb-8">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-50 mb-4 shadow-lg">
                     <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" alt="Caller" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-lg font-black text-[#111]">Charlie Hawkins</div>
                  <div className="text-sm text-slate-400">+1 (514) 257-8561</div>
               </div>
               <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-11 rounded-xl text-[13px] font-bold gap-2 border-slate-100"><Volume2 className="w-4 h-4 text-slate-400" /> Voicemail</Button>
                  <Button className="w-11 h-11 p-0 bg-rose-500 hover:bg-rose-600 rounded-xl"><PhoneCall className="w-5 h-5 text-white rotate-[135deg]" /></Button>
               </div>
               <div className="absolute -top-8 -left-12 bg-white rounded-2xl shadow-xl border border-slate-50 p-6 w-56 animate-float">
                  <div className="text-[12px] font-black text-[#111] mb-4 uppercase tracking-widest">Call list</div>
                  <div className="space-y-4">
                     {[
                       { name: "Oscar Reed", phone: "415-985", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" },
                       { name: "Fiona Clark", phone: "514-869", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" }
                     ].map((c, i) => (
                       <div key={i} className="flex items-center gap-3">
                          <img src={c.img} className="w-7 h-7 rounded-full object-cover" alt="" />
                          <div>
                             <div className="text-[11px] font-bold text-[#111] leading-none mb-0.5">{c.name}</div>
                             <div className="text-[9px] text-slate-400">{c.phone}</div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-8">
          <h2 className="text-[48px] md:text-[64px] font-black text-[#111] tracking-tighter leading-none">Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0000EE] to-[#E1B2FF]">grow?</span></h2>
          <div className="flex gap-3 justify-center">
             <Button size="lg" className="bg-[#111] text-white px-10 h-14 text-base font-bold rounded-2xl shadow-xl transition-all hover:scale-105" onClick={() => window.location.href='/dashboard'}>Start for free</Button>
             <Button variant="outline" size="lg" className="px-10 h-14 text-base border-slate-200 text-[#111] bg-white rounded-2xl transition-all hover:scale-105" onClick={() => setLocation("/demo")}>Talk to sales</Button>
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
