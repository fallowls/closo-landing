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
  LayoutDashboard,
  Volume2,
  Wifi,
  Lock,
  Play
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
    <div className="min-h-screen bg-white text-[#111] selection:bg-[#E1B2FF]/30 font-sans tracking-tight">
      <SEO 
        title="Closo | The phone platform for B2B commerce" 
        description="Drive new sales and discover unique insights by engaging with your customers profitably on the phone."
      />
      
      {/* Background Grid Pattern - Very subtle matching Consio */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: `radial-gradient(#111 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} 
      />

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showHeader ? 'py-2 border-b border-slate-100 bg-white/80 backdrop-blur-md' : 'py-4'}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/"><img src={closoLogo} alt="Closo" className="h-5 cursor-pointer" /></Link>
            <div className="hidden lg:flex items-center gap-8">
              {['Product', 'Resources', 'Customers', 'Pricing'].map(item => (
                <div key={item} className="flex items-center gap-1 cursor-pointer group">
                  <span className="text-[15px] font-medium text-slate-600 group-hover:text-[#111] transition-colors">{item}</span>
                  <ChevronRight className="w-3 h-3 rotate-90 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[15px] font-medium text-slate-600 hover:text-[#111]">Log in</Link>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-[15px] font-medium hover:bg-slate-50 px-4 h-10 rounded-lg border border-slate-100">Sign up free</Button>
              <Button className="bg-[#111] hover:bg-black text-white px-5 h-10 text-[15px] font-medium rounded-lg shadow-sm" onClick={() => window.location.href='/dashboard'}>Book a demo</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Compact & Centered */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Main Hero Image with Floating UI */}
          <div className="relative w-[340px] h-[340px] mx-auto mb-10">
            <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-2xl z-10">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" alt="Hero" className="w-full h-full object-cover" />
            </div>
            {/* Floating Elements exactly matching screenshots */}
            <div className="absolute -left-12 top-1/3 bg-white p-3 rounded-xl shadow-2xl border border-slate-50 z-20 animate-bounce-slow">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Voicemail dropped</span>
              </div>
              <div className="text-xl font-black text-[#111]">$18,600</div>
              <div className="text-[9px] text-slate-400 font-bold mt-1">Total revenue</div>
            </div>
            <div className="absolute -right-16 top-1/2 bg-white p-3 rounded-xl shadow-2xl border border-slate-50 z-20 animate-float">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">CH</div>
                 <div className="text-left">
                   <div className="text-[11px] font-bold text-[#111]">Charlie Hawkins • 1st call</div>
                   <div className="flex gap-1 mt-1">
                      <div className="px-2 py-0.5 bg-[#E1B2FF]/20 text-[#E1B2FF] rounded text-[8px] font-black uppercase">Call in progress</div>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm text-[12px] font-medium text-slate-600 mb-10">
            <span className="text-[#0000EE]">📣</span>
            <span>Closo raises $3.3M</span>
            <Link href="/blog" className="flex items-center gap-1 ml-2 text-slate-400 hover:text-[#111] border-l pl-2 border-slate-200">
              Read <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          
          <h1 className="text-[56px] md:text-[80px] font-bold tracking-tight mb-8 leading-[1.05] text-[#111] max-w-4xl mx-auto">
            The phone platform for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E1B2FF] to-[#0000EE]">B2B commerce</span>
          </h1>
          
          <p className="text-[18px] text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Drive new sales and discover unique insights by engaging with your customers profitably on the phone.
          </p>
          
          <div className="flex gap-4 justify-center mb-20">
            <Button size="lg" className="bg-[#111] hover:bg-black text-white px-10 h-14 text-base font-bold rounded-xl shadow-lg" onClick={() => window.location.href='/dashboard'}>Start for free</Button>
            <Button variant="outline" size="lg" className="px-10 h-14 text-base border-slate-200 text-[#111] bg-white hover:bg-slate-50 rounded-xl">Book a demo</Button>
          </div>

          <div className="pt-12 border-t border-slate-100 flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale">
            {['MICHAEL TODD', 'Polysleep', 'JAXXON', 'BATTLEX', 'H-ARNY', 'Audien Hearing'].map(brand => (
              <div key={brand} className="text-xl font-bold text-[#111]">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-Hero Section 1: Voice Platform */}
      <section className="py-24 bg-white text-center border-t border-slate-50">
        <div className="max-w-4xl mx-auto px-6">
           <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[12px] font-bold mb-8">
             Introducing Closo
           </div>
           <h2 className="text-[48px] md:text-[64px] font-bold text-[#111] mb-6 leading-tight">A voice platform <br /> built for growth</h2>
           <p className="text-[18px] text-slate-500 mb-20">Everything you need to turn phone calls into revenue, natively integrated with your business stack.</p>
           
           <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Ecom Power Dialer", icon: PhoneCall, color: "text-purple-500" },
                { title: "AI Voice Agents", icon: Mic, color: "text-rose-500" },
                { title: "AI Phone Hub", icon: Layers, color: "text-amber-500" }
              ].map((item, i) => (
                <Card key={i} className="bg-[#F9F9FB] border-none rounded-[2rem] p-8 text-left hover:shadow-xl transition-all cursor-pointer">
                   <div className={`w-12 h-12 flex items-center justify-center mb-6 ${item.color}`}>
                      <item.icon className="w-8 h-8" />
                   </div>
                   <h3 className="text-2xl font-bold text-[#111]">{item.title}</h3>
                </Card>
              ))}
           </div>
        </div>
      </section>

      {/* Sub-Hero Section 2: Sales Channel */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-[12px] font-black uppercase">
              Ecommerce Power Dialer
            </div>
            <h2 className="text-[48px] font-bold text-[#111] leading-[1.1]">Add a new <br /> sales channel : <br /> Outbound Phone</h2>
            <ul className="space-y-4 text-[16px] text-slate-600 font-medium">
               <li className="flex gap-2"><span>•</span> Call shoppers at the perfect moment to drive conversions.</li>
               <li className="flex gap-2"><span>•</span> Automatically drop voicemails directly to their inbox.</li>
               <li className="flex gap-2"><span>•</span> Run campaigns on high-value segments like abandoned checkouts.</li>
            </ul>
            <Button size="lg" className="bg-[#111] text-white px-8 h-14 rounded-xl font-bold">Tour the platform</Button>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-purple-200 rounded-[3rem] blur-[120px] opacity-20" />
             <div className="relative bg-purple-300/30 rounded-[3rem] p-12">
                <Card className="bg-white rounded-[2rem] border-none shadow-2xl p-8 relative">
                   <div className="flex items-center gap-3 mb-8">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-400">Call in progress (0:03)</span>
                   </div>
                   <div className="flex flex-col items-center mb-8">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-50 mb-4">
                         <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" alt="Caller" />
                      </div>
                      <div className="text-xl font-bold text-[#111]">Charlie Hawkins</div>
                      <div className="text-sm text-slate-400">+1 (514) 257-8561</div>
                   </div>
                   <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 h-12 rounded-xl text-[13px] font-bold gap-2">
                         <Volume2 className="w-4 h-4" /> Drop voicemail
                      </Button>
                      <Button className="w-12 h-12 p-0 bg-rose-500 hover:bg-rose-600 rounded-xl">
                         <PhoneCall className="w-5 h-5 text-white rotate-[135deg]" />
                      </Button>
                   </div>
                   
                   {/* Call List Overlay */}
                   <div className="absolute top-1/2 -left-20 bg-white rounded-2xl shadow-2xl border border-slate-50 p-6 w-64 animate-float">
                      <div className="text-[13px] font-bold text-[#111] mb-4">Call list</div>
                      <div className="space-y-4">
                         {[
                           { name: "Oscar Reed", phone: "+1 (415) 985-6822", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" },
                           { name: "Fiona Clark", phone: "+1 (514) 869-5657", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" }
                         ].map((c, i) => (
                           <div key={i} className="flex items-center gap-3">
                              <img src={c.img} className="w-8 h-8 rounded-full" alt="" />
                              <div>
                                 <div className="text-[11px] font-bold text-[#111]">{c.name}</div>
                                 <div className="text-[9px] text-slate-400">{c.phone}</div>
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

      {/* Floating UI Elements */}
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
