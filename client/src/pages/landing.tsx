import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PhoneCall,
  Mic,
  Users,
  Zap,
  ArrowRight,
  Sparkles,
  PhoneIncoming,
  PhoneOutgoing,
  Voicemail,
  Radio,
  PhoneForwarded,
  Volume2,
  MessageSquare,
  Target,
  Wifi,
  Activity,
  Lock,
  CloudLightning,
  AlertCircle,
  BarChart2,
  ChevronRight,
  Menu,
  Code,
  Smartphone,
  Laptop,
  Database,
  ArrowUpRight
} from "lucide-react";
import { setAuthenticated } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import closoLogo from "@assets/closo_logo_png_1768558486274.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";
import { SEO } from "@/components/SEO";

export default function Landing() {
  const [showHeader, setShowHeader] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-[#0000EE] selection:bg-[#E1B2FF]/30 font-sans tracking-tight">
      <SEO 
        title="Closo | The phone platform for subscriptions" 
        description="Drive new sales and discover unique insights by engaging with your customers profitably on the phone."
      />
      
      {/* Background Grid Pattern - Matching Consio */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: `radial-gradient(#0000EE 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} 
      />

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${showHeader ? 'py-2 border-b border-[#0000EE]/5 bg-white/80 backdrop-blur-md' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <Link href="/">
                <img src={closoLogo} alt="Closo" className="h-6 cursor-pointer" style={{ filter: 'none' }} />
              </Link>
              <div className="hidden md:flex items-center gap-8">
                {['Product', 'Resources', 'Customers', 'Pricing'].map(item => (
                  <div key={item} className="flex items-center gap-1 cursor-pointer group">
                    <span className="text-[15px] font-medium text-slate-600 group-hover:text-[#0000EE] transition-colors">{item}</span>
                    <ChevronRight className="w-3 h-3 rotate-90 text-slate-400 group-hover:text-[#0000EE] transition-transform" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-[15px] font-medium text-slate-600 hover:text-[#0000EE] transition-colors">Log in</Link>
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="text-[15px] font-medium hover:bg-slate-100 px-4 h-10 rounded-lg">Sign up free</Button>
                <Button className="bg-[#111] hover:bg-black text-white px-5 h-10 text-[15px] font-medium rounded-lg shadow-sm" onClick={() => window.location.href='/dashboard'}>Book a demo</Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Circular Image Collage - Hero Section */}
          <div className="relative w-64 h-64 mx-auto mb-12">
            <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-white shadow-2xl z-20">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" 
                alt="Representative" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating UI Elements */}
            <div className="absolute -left-20 top-1/4 bg-white p-3 rounded-xl shadow-xl border border-slate-100 z-30 animate-bounce-slow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inbound dropped</span>
              </div>
              <div className="text-xl font-bold text-[#111]">$18,600</div>
              <div className="text-[10px] text-slate-400 font-medium mt-1">Total revenue</div>
            </div>
            <div className="absolute -right-24 bottom-1/4 bg-white p-3 rounded-xl shadow-xl border border-slate-100 z-30 animate-float">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-full bg-[#E1B2FF] flex items-center justify-center text-xs font-bold text-white">CH</div>
                 <div>
                   <div className="text-[11px] font-bold text-[#111]">Charlie Hawkins</div>
                   <div className="text-[9px] text-slate-400">Calling...</div>
                 </div>
               </div>
               <div className="flex gap-2">
                 <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-[#E1B2FF] w-2/3" />
                 </div>
               </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm text-[12px] font-medium text-slate-600 mb-8">
            <span className="text-rose-500">📣</span>
            <span>Closo raises $3.3M</span>
            <Link href="/blog" className="flex items-center gap-1 ml-2 text-slate-400 hover:text-[#0000EE] transition-colors border-l pl-2 border-slate-200">
              Read <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          
          <h1 className="text-6xl md:text-[80px] font-bold tracking-[-0.04em] mb-8 leading-[1.05] text-[#111] max-w-4xl mx-auto">
            The phone platform for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E1B2FF] to-[#0000EE]">subscriptions</span>
          </h1>
          
          <p className="text-[19px] text-slate-500 mb-12 max-w-xl mx-auto leading-relaxed font-normal">
            Drive new sales and discover unique insights by engaging with your customers profitably on the phone.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24">
            <Button size="lg" className="bg-[#111] hover:bg-black text-white px-8 h-14 text-base font-semibold rounded-xl transition-all shadow-lg hover:translate-y-[-2px]" onClick={() => window.location.href='/dashboard'}>Start for free</Button>
            <Button variant="outline" size="lg" className="px-8 h-14 text-base border-slate-200 text-[#111] bg-white hover:bg-slate-50 rounded-xl transition-all hover:translate-y-[-2px]" onClick={() => setLocation("/demo")}>Book a demo</Button>
          </div>

          {/* Logo Cloud Section */}
          <div className="pt-12 border-t border-slate-100">
            <p className="text-[12px] font-medium text-slate-400 uppercase tracking-[0.15em] mb-10">Powering revenue-driving phone sales for</p>
            <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              {['KALA', 'routine', 'EVOLV', 'diyversify', 'MENE', 'medterra'].map(brand => (
                <div key={brand} className="text-2xl font-black text-slate-900 tracking-tighter">{brand}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chat Button - Bottom Right */}
      <div className="fixed bottom-8 right-8 z-[100] flex items-center gap-3">
        <div className="bg-white p-2 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-2 group cursor-pointer hover:scale-105 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#E1B2FF]/20 flex items-center justify-center">
             <MessageSquare className="w-5 h-5 text-[#E1B2FF]" />
          </div>
          <div className="bg-[#111] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-[14px] font-bold">
            <PhoneCall className="w-4 h-4" />
            Start a call
          </div>
        </div>
      </div>

      <EnterpriseFooter />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
