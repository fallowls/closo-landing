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
  ArrowUpRight,
  Globe,
  CheckCircle2,
  BarChart3,
  Search,
  Layers,
  ShieldCheck,
  ZapIcon
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
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: `radial-gradient(#0000EE 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} 
      />

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${showHeader ? 'py-2 border-b border-[#0000EE]/5 bg-white/80 backdrop-blur-md shadow-sm' : 'py-6'}`}>
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="relative w-64 h-64 mx-auto mb-12">
            <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-white shadow-2xl z-20">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" 
                alt="Representative" 
                className="w-full h-full object-cover"
              />
            </div>
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

      {/* Feature Section 1: Visibility */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E1B2FF]/10 text-[#E1B2FF] rounded-lg text-[12px] font-bold uppercase tracking-wider">
                <Search className="w-4 h-4" />
                <span>Visibility</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111] leading-tight">
                Understand the "Why" <br /> behind every call
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                Closo automatically records, transcribes, and analyzes every conversation using proprietary AI models tuned for high-growth sales environments.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Sentiment Analysis", desc: "Instantly detect customer mood and purchase intent." },
                  { title: "Keyword Extraction", desc: "Identify recurring objections or feature requests." },
                  { title: "Automated Coaching", desc: "Real-time tips for reps based on live conversation flow." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111]">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#0000EE]/5 rounded-[3rem] blur-3xl opacity-50 translate-x-12 translate-y-12" />
              <div className="relative bg-[#111] rounded-[2.5rem] p-8 shadow-2xl border border-white/10 overflow-hidden group">
                 {/* Mock UI: Call Transcript Analysis */}
                 <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800" />
                        <div>
                          <div className="text-sm font-bold text-white">Call with David Miller</div>
                          <div className="text-[10px] text-slate-400">Duration: 12m 45s</div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase">High Intent</div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                        <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">AI Summary</p>
                        <p className="text-sm text-slate-200 italic">"The customer expressed significant interest in the annual plan but had concerns regarding data migration timelines. Recommendation: Send migration whitepaper."</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                          <p className="text-[10px] text-slate-400 mb-1 font-bold">SENTIMENT</p>
                          <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden mt-2">
                             <div className="h-full bg-emerald-400 w-4/5" />
                          </div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                          <p className="text-[10px] text-slate-400 mb-1 font-bold">OBJECTIONS</p>
                          <div className="flex gap-1 mt-2">
                            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded-md text-[9px] font-bold">Pricing</span>
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-md text-[9px] font-bold">Setup</span>
                          </div>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Global Dialing */}
      <section className="py-32 bg-[#F9F9FB] border-y border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1 relative">
               <div className="absolute inset-0 bg-[#E1B2FF]/10 rounded-full blur-[120px] opacity-30 -translate-x-1/4" />
               <div className="relative grid grid-cols-2 gap-6">
                 {[
                   { icon: Globe, val: "190+", label: "Countries" },
                   { icon: Activity, val: "< 50ms", label: "Latency" },
                   { icon: ShieldCheck, val: "SOC 2", label: "Compliant" },
                   { icon: ZapIcon, val: "10x", label: "Efficiency" }
                 ].map((stat, i) => (
                   <Card key={i} className="bg-white border-slate-100 shadow-xl rounded-3xl p-8 hover:translate-y-[-4px] transition-all">
                      <div className="w-12 h-12 bg-[#0000EE]/5 rounded-2xl flex items-center justify-center mb-6">
                         <stat.icon className="w-6 h-6 text-[#0000EE]" />
                      </div>
                      <div className="text-3xl font-black text-[#111] mb-1">{stat.val}</div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                   </Card>
                 ))}
               </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0000EE]/10 text-[#0000EE] rounded-lg text-[12px] font-bold uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>Connectivity</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111] leading-tight">
                Connect globally, <br /> dial locally
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                Our global edge network ensures crystal-clear HD audio and localized caller IDs, increasing your pick-up rates by up to 300%.
              </p>
              <Button size="lg" className="bg-[#111] hover:bg-black text-white px-8 h-14 text-base font-semibold rounded-xl transition-all shadow-lg hover:translate-y-[-2px]">
                Explore Network <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Infrastructure Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black text-[#111] tracking-tight">The infra for high volume</h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">Built to handle millions of interactions with sub-millisecond latency.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { 
                title: "Real-time Parallel Dialing", 
                desc: "Connect to up to 10 lines simultaneously with zero-latency handoffs when a prospect answers.", 
                icon: Layers,
                color: "from-blue-500 to-indigo-500"
              },
              { 
                title: "Deep CRM Integration", 
                desc: "Two-way sync with Salesforce, HubSpot, and Pipedrive. Log calls and activities automatically.", 
                icon: Database,
                color: "from-purple-500 to-pink-500"
              },
              { 
                title: "Compliance-First Design", 
                desc: "Built-in STIR/SHAKEN verification and TCPA compliance tools to keep your numbers reputable.", 
                icon: ShieldCheck,
                color: "from-emerald-500 to-teal-500"
              }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-[#F9F9FB] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                   <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#111] mb-4">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer API Section */}
      <section className="py-32 bg-[#111] text-white overflow-hidden rounded-[4rem] mx-6 my-12">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white/60 rounded-lg text-[12px] font-bold uppercase tracking-wider">
                <Code className="w-4 h-4" />
                <span>Developers</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">Build on top of <br /> our core infra</h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-lg">
                Programmatic control over every call. Our REST APIs and SDKs allow you to automate everything from call routing to real-time analytics.
              </p>
              <div className="flex flex-wrap gap-4">
                 <Button className="bg-white text-[#111] hover:bg-slate-100 h-14 px-8 rounded-xl font-bold">View Documentation</Button>
                 <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white h-14 px-8 rounded-xl font-bold">Get API Key</Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-slate-900 rounded-[2rem] p-8 border border-white/10 shadow-3xl font-mono text-sm leading-relaxed overflow-hidden">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-blue-400">const <span className="text-slate-200">client</span> = <span className="text-purple-400">new</span> <span className="text-emerald-400">Closo</span>({'{'}</p>
                  <p className="pl-4">apiKey: <span className="text-orange-400">'cl_live_938fhsk...'</span></p>
                  <p className="text-slate-200">{'}'});</p>
                  <p className="text-slate-500">// Start a parallel dial session</p>
                  <p className="text-blue-400">await <span className="text-slate-200">client.sessions</span>.<span className="text-emerald-400">create</span>({'{'}</p>
                  <p className="pl-4">lines: <span className="text-rose-400">5</span>,</p>
                  <p className="pl-4">contacts: [<span className="text-orange-400">'+1234567890'</span>, <span className="text-orange-400">'+1987654321'</span>],</p>
                  <p className="pl-4">webhookUrl: <span className="text-orange-400">'https://app.com/v1/calls'</span></p>
                  <p className="text-slate-200">{'}'});</p>
                </div>
                {/* Visual Glow */}
                <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-[#E1B2FF]/20 blur-[100px] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-5xl md:text-8xl font-black text-[#111] tracking-tighter leading-none">Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0000EE] to-[#E1B2FF]">grow?</span></h2>
          <p className="text-2xl text-slate-500 font-medium">Join the high-growth teams driving millions in revenue with Closo.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Button size="lg" className="bg-[#111] hover:bg-black text-white px-12 h-16 text-lg font-bold rounded-2xl transition-all shadow-2xl hover:scale-105" onClick={() => window.location.href='/dashboard'}>Start for free</Button>
             <Button variant="outline" size="lg" className="px-12 h-16 text-lg border-slate-200 text-[#111] bg-white hover:bg-slate-50 rounded-2xl transition-all hover:scale-105" onClick={() => setLocation("/demo")}>Book a demo</Button>
          </div>
        </div>
      </section>

      {/* Floating Call Button */}
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
