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
  Database
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
  const [activeFeature, setActiveFeature] = useState(0);
  const [typedCode, setTypedCode] = useState("");
  const [hoveredCapability, setHoveredCapability] = useState(0);
  const [showHeader, setShowHeader] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const codeSnippets = [
    `const client = new Closo({
  apiKey: process.env.CLOSO_API_KEY
});

await client.calls.create({
  to: '+1234567890',
  from: '+0987654321',
  record: true
});`,
    `import ClosoSDK
let closo = Closo(apiKey: apiKey)
closo.makeCall(to: "+1234567890")`,
    `const closo = new ClosoWeb({ apiKey: 'key' });
await closo.initializeDevice();
await closo.call({ to: '+1234567890' });`,
    `POST https://api.closo.com/webhooks
{
  "url": "https://app.com/webhook",
  "events": ["call.started"]
}`
  ];

  useEffect(() => {
    const codeText = codeSnippets[hoveredCapability];
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= codeText.length) {
        setTypedCode(codeText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setTimeout(() => { currentIndex = 0; }, 2000);
      }
    }, 30);
    return () => clearInterval(typingInterval);
  }, [hoveredCapability]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-purple-500/30 font-sans tracking-tight">
      <SEO title="Closo | Enterprise Lead Intelligence" />
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${showHeader ? 'py-3' : 'py-6'}`}>
        <div className="max-w-5xl mx-auto px-6">
          <div className={`flex items-center justify-between px-6 py-2 rounded-2xl border transition-all duration-500 ${showHeader ? 'bg-slate-900/80 backdrop-blur-md border-white/10 shadow-xl' : 'bg-transparent border-transparent'}`}>
            <img src={closoLogo} alt="Closo" className="h-7 brightness-0 invert" />
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'About', 'Blog'].map(item => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{item}</Link>
              ))}
              <Button size="sm" className="bg-white hover:bg-slate-200 text-slate-950 rounded-lg px-5 h-9 font-bold" onClick={() => window.location.href='/dashboard'}>Dashboard</Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-8 animate-fade-in-down shadow-inner">
            <Sparkles className="w-3 h-3" />
            <span>Introducing Closo 2.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Intelligence</span>
            <br /> for Sales Teams
          </h1>
          
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Enterprise-grade lead scoring and contact intelligence platform designed for high-performance sales teams.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-white hover:bg-slate-200 text-slate-950 px-8 h-12 text-sm font-bold rounded-xl shadow-lg shadow-white/5 transition-transform hover:scale-[1.02] active:scale-[0.98]" onClick={() => window.location.href='/dashboard'}>Get Started <ArrowRight className="ml-2 w-4 h-4" /></Button>
            <Button variant="outline" size="lg" className="px-8 h-12 text-sm border-white/10 text-slate-300 hover:bg-white/5 rounded-xl transition-transform hover:scale-[1.02]" onClick={() => setLocation("/demo")}>Book a Demo</Button>
          </div>

          <div className="relative group max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-50" />
            <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl grid grid-cols-3 gap-4">
              {[
                { label: "Precision", value: "98.2%", color: "text-blue-400" },
                { label: "Reach", value: "2.4M+", color: "text-purple-400" },
                { label: "Growth", value: "+142%", color: "text-emerald-400" }
              ].map((s, i) => (
                <div key={i} className="text-center p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/[0.08]">
                  <div className={`text-xl font-bold mb-1 ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-slate-900">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3">Enterprise Core</h2>
            <p className="text-slate-500 text-sm">Scalable tools for high-growth outreach</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: PhoneOutgoing, title: "Outbound", desc: "Global calling reach" },
              { icon: PhoneIncoming, title: "Inbound", desc: "Smart call routing" },
              { icon: Mic, title: "Intelligence", desc: "AI transcriptions" },
              { icon: Voicemail, title: "Voicemail", desc: "Custom drop-ins" },
              { icon: Radio, title: "Programmable", desc: "Custom API hooks" },
              { icon: MessageSquare, title: "Omnichannel", desc: "SMS & Voice sync" }
            ].map((f, i) => (
              <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 text-slate-900">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Developer First</h2>
            <div className="space-y-4">
              {[
                { icon: Code, title: "REST API", active: hoveredCapability === 0 },
                { icon: Smartphone, title: "Mobile SDK", active: hoveredCapability === 1 },
                { icon: Laptop, title: "Web SDK", active: hoveredCapability === 2 },
                { icon: Database, title: "Webhooks", active: hoveredCapability === 3 }
              ].map((c, i) => (
                <div key={i} onMouseEnter={() => setHoveredCapability(i)} className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${c.active ? 'bg-white border-purple-200 shadow-sm translate-x-1' : 'bg-transparent border-transparent grayscale opacity-60'}`}>
                  <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center"><c.icon className="w-4 h-4 text-white" /></div>
                  <span className="font-bold text-sm">{c.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl border border-white/5 font-mono text-[11px] text-purple-400 min-h-[300px]">
            <div className="flex gap-1.5 mb-6">
              {[1, 2, 3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/10" />)}
            </div>
            <pre>{typedCode}<span className="animate-pulse">_</span></pre>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-3">
              {[
                { icon: Wifi, title: "Reliability", active: activeFeature === 0 },
                { icon: Activity, title: "Monitoring", active: activeFeature === 1 },
                { icon: Lock, title: "Security", active: activeFeature === 2 },
                { icon: CloudLightning, title: "Infrastructure", active: activeFeature === 3 },
                { icon: AlertCircle, title: "Alerting", active: activeFeature === 4 },
                { icon: BarChart2, title: "Analytics", active: activeFeature === 5 }
              ].map((f, i) => (
                <div key={i} onMouseEnter={() => setActiveFeature(i)} className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${f.active ? 'bg-purple-50 border-purple-100' : 'bg-white border-transparent grayscale opacity-50'}`}>
                  <div className="flex items-center gap-4">
                    <f.icon className={`w-4 h-4 ${f.active ? 'text-purple-600' : 'text-slate-400'}`} />
                    <span className={`text-sm font-bold ${f.active ? 'text-slate-950' : 'text-slate-500'}`}>{f.title}</span>
                  </div>
                  {f.active && <div className="w-1 h-1 rounded-full bg-purple-600" />}
                </div>
              ))}
            </div>
            <div className="aspect-video bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center p-8 text-center shadow-inner">
              <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center shadow-xl">
                  {(() => {
                    const icons = [Wifi, Activity, Lock, CloudLightning, AlertCircle, BarChart2];
                    const Icon = icons[activeFeature];
                    return <Icon className="w-8 h-8 text-white" />;
                  })()}
                </div>
                <h3 className="font-bold text-xl">System Node {activeFeature + 1}</h3>
                <p className="text-sm text-slate-500 max-w-xs">Optimized background processing for enterprise-scale communication workloads.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </div>
  );
}
