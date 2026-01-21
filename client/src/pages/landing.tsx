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
  ArrowUpRight
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
        title="Closo | The phone platform for subscriptions" 
        description="Drive new sales and discover unique insights by engaging with your customers profitably on the phone."
      />
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: `radial-gradient(#0000EE 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} 
      />

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showHeader ? 'py-2 border-b border-[#0000EE]/5 bg-white/80 backdrop-blur-md' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/"><img src={closoLogo} alt="Closo" className="h-5 cursor-pointer" /></Link>
            <div className="hidden md:flex items-center gap-6">
              {['Product', 'Resources', 'Pricing'].map(item => (
                <div key={item} className="flex items-center gap-1 cursor-pointer group">
                  <span className="text-[14px] font-medium text-slate-600 group-hover:text-[#0000EE] transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[14px] font-medium text-slate-600 hover:text-[#0000EE]">Log in</Link>
            <Button className="bg-[#111] hover:bg-black text-white px-4 h-9 text-[14px] font-medium rounded-lg" onClick={() => window.location.href='/dashboard'}>Book a demo</Button>
          </div>
        </div>
      </nav>

      <section className="relative pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-white shadow-xl z-20">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" alt="Hero" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -left-12 top-1/4 bg-white p-2 rounded-lg shadow-lg border border-slate-100 z-30 animate-bounce-slow">
              <div className="text-lg font-bold text-[#111]">$18.6k</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase">Revenue</div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-100 shadow-sm text-[11px] font-medium text-slate-600 mb-6">
            <span className="text-rose-500">📣</span>
            <span>Closo raises $3.3M</span>
            <Link href="/blog" className="flex items-center gap-1 ml-2 text-slate-400 border-l pl-2">Read <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-[#111]">
            The phone platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E1B2FF] to-[#0000EE]">subscriptions</span>
          </h1>
          
          <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto">
            Drive new sales and discover unique insights by engaging with your customers profitably on the phone.
          </p>
          
          <div className="flex gap-3 justify-center mb-16">
            <Button size="lg" className="bg-[#111] text-white px-8 h-12 text-sm font-semibold rounded-lg shadow-lg" onClick={() => window.location.href='/dashboard'}>Start free</Button>
            <Button variant="outline" size="lg" className="px-8 h-12 text-sm border-slate-200 text-[#111] bg-white rounded-lg">Book demo</Button>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-40 grayscale">
            {['KALA', 'routine', 'EVOLV', 'MENE', 'medterra'].map(brand => (
              <div key={brand} className="text-xl font-black text-slate-900">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-[#E1B2FF]/10 text-[#E1B2FF] rounded text-[11px] font-bold uppercase tracking-wider">
              <Search className="w-3 h-3" /><span>Visibility</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111]">Understand the "Why"</h2>
            <p className="text-slate-500">Closo automatically records, transcribes, and analyzes every conversation using proprietary AI models.</p>
            <div className="space-y-3">
              {["Sentiment Analysis", "Keyword Extraction"].map((t, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-sm text-[#111]">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#111] rounded-3xl p-6 shadow-2xl border border-white/10">
             <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800" />
                    <div className="text-xs font-bold text-white">Call with David Miller</div>
                  </div>
                  <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[9px] font-bold">High Intent</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-white/5 text-[13px] text-slate-200 italic">"The customer expressed significant interest in the annual plan..."</div>
             </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F9F9FB] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            { title: "Global Reach", val: "190+", label: "Countries", icon: Globe },
            { title: "Latency", val: "< 50ms", label: "Edge network", icon: Zap },
            { title: "Security", val: "SOC 2", label: "Certified", icon: ShieldCheck }
          ].map((s, i) => (
            <Card key={i} className="bg-white border-slate-100 rounded-2xl p-6 shadow-sm">
               <div className="w-10 h-10 bg-[#0000EE]/5 rounded-xl flex items-center justify-center mb-4"><s.icon className="w-5 h-5 text-[#0000EE]" /></div>
               <div className="text-2xl font-black text-[#111] mb-1">{s.val}</div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-24 bg-[#111] text-white rounded-[3rem] mx-6 my-12">
        <div className="max-w-7xl mx-auto px-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Build on our <br /> core infra</h2>
            <p className="text-slate-400 font-medium">Programmatic control over every call. Our REST APIs and SDKs allow you to automate everything.</p>
            <div className="flex gap-4">
               <Button className="bg-white text-[#111] hover:bg-slate-100 h-11 px-6 rounded-lg font-bold">Docs</Button>
               <Button variant="outline" className="border-white/20 hover:bg-white/10 h-11 px-6 rounded-lg font-bold">Get Key</Button>
            </div>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/10 font-mono text-xs leading-relaxed text-slate-300">
            <p className="text-blue-400">const <span className="text-slate-200">client</span> = <span className="text-purple-400">new</span> <span className="text-emerald-400">Closo</span>();</p>
            <p className="text-blue-400">await <span className="text-slate-200">client.sessions</span>.<span className="text-emerald-400">create</span>({'{'}</p>
            <p className="pl-4">lines: <span className="text-rose-400">5</span>,</p>
            <p className="pl-4">webhookUrl: <span className="text-orange-400">'https://app.com/v1'</span></p>
            <p className="text-slate-200">{'}'});</p>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-8">
          <h2 className="text-5xl font-black text-[#111] tracking-tighter leading-none">Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0000EE] to-[#E1B2FF]">grow?</span></h2>
          <div className="flex gap-4 justify-center">
             <Button size="lg" className="bg-[#111] text-white px-10 h-14 text-base font-bold rounded-xl shadow-xl" onClick={() => window.location.href='/dashboard'}>Start free</Button>
             <Button variant="outline" size="lg" className="px-10 h-14 text-base border-slate-200 text-[#111] rounded-xl" onClick={() => setLocation("/demo")}>Book demo</Button>
          </div>
        </div>
      </section>

      <div className="fixed bottom-8 right-8 z-[100]">
        <div className="bg-white p-2 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#E1B2FF]/20 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-[#E1B2FF]" /></div>
          <div className="bg-[#111] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-[14px] font-bold"><PhoneCall className="w-4 h-4" />Start call</div>
        </div>
      </div>

      <EnterpriseFooter />
      <style>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
