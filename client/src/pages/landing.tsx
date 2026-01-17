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
      <SEO 
        title="Closo | Enterprise Lead Intelligence" 
        description="Enterprise-grade lead scoring and contact intelligence platform designed for high-performance sales teams."
      />
      
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

      {/* AI Prospecting Section */}
      <section className="py-24 bg-white text-slate-900 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl opacity-60" />
              <div className="relative space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  <Target className="w-3 h-3" />
                  <span>AI-Driven Prospecting</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                  Qualify Leads with <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Unmatched Precision</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                  Closo's advanced AI engine analyzes millions of data points to identify your ideal customer profiles, scoring every lead based on real-time intent and behavioral signals.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Data Sources", value: "50+", desc: "Real-time verification" },
                    { label: "Intent Signals", value: "200+", desc: "Behavioral tracking" }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-sm font-bold text-slate-600">{stat.label}</div>
                      <p className="text-xs text-slate-400">{stat.desc}</p>
                    </div>
                  ))}
                </div>
                <Button size="lg" className="bg-slate-900 text-white rounded-xl px-8 h-12 text-sm font-bold shadow-xl hover:bg-slate-800 transition-all hover:scale-105">
                  Explore AI Scoring
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-[2.5rem] -rotate-2" />
              <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50">
                <div className="space-y-6">
                  {[
                    { title: "Decision Maker Identification", progress: 95, color: "bg-blue-500" },
                    { title: "Budget Authority Scoring", progress: 88, color: "bg-purple-500" },
                    { title: "Purchase Intent Analysis", progress: 92, color: "bg-emerald-500" },
                    { title: "Engagement Probability", progress: 84, color: "bg-orange-500" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                        <span>{item.title}</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parallel Dialer Section */}
      <section className="py-16 bg-slate-950 text-white border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-blue-500/5 opacity-50" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                <Zap className="w-3 h-3" />
                <span>Parallel Dialing</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Scale Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Outreach 5x</span>
              </h2>
              <p className="text-base text-slate-400 leading-relaxed max-w-lg">
                Dial up to 10 lines simultaneously and connect instantly when someone answers. Spend 80% of your time talking, not waiting.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "Conversation Volume", desc: "5x more talk time", icon: PhoneOutgoing },
                  { title: "Instant Connect", desc: "Zero-latency live calls", icon: Zap },
                  { title: "Smart VM Detection", desc: "AI skips voicemails", icon: Mic },
                  { title: "Live Coaching", desc: "Real-time call join", icon: Users }
                ].map((benefit, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all group flex gap-3 items-start">
                    <benefit.icon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm mb-0.5">{benefit.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-tight">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full -mr-24 -mt-24" />
              
              <div className="relative space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                      <PhoneCall className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-blue-400">Dialer Active</div>
                      <div className="text-[10px] text-slate-400">5 Lines Live</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-emerald-400">
                    TALK TIME: 4h 12m
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 relative">
                  {[1, 2, 3, 4, 5].map((line) => (
                    <div key={line} className="relative flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-700 ${
                        line === 3 
                          ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-110' 
                          : 'bg-white/5 border border-white/10'
                      }`}>
                        <Users className={`w-4 h-4 ${line === 3 ? 'text-white' : 'text-slate-600'}`} />
                      </div>
                      <div className={`text-[8px] font-bold uppercase tracking-tighter ${
                        line === 3 ? 'text-emerald-400' : 'text-slate-500'
                      }`}>
                        {line === 3 ? 'Live' : 'Dial...'}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl grid grid-cols-3 gap-2">
                  {[
                    { label: "Connect", value: "24%", change: "+12%" },
                    { label: "Wait", value: "8s", change: "-42s" },
                    { label: "Dials/Hr", value: "140", change: "+310%" }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-sm font-bold">{stat.value}</div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{stat.label}</div>
                      <div className="text-[8px] text-emerald-400 font-bold">{stat.change}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for Scale</h2>
            <p className="text-slate-400 text-lg">Our global infrastructure handles millions of interactions with sub-millisecond latency.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Global Reach", value: "190+", sub: "Countries supported", icon: CloudLightning },
              { title: "Uptime SLA", value: "99.99%", sub: "Enterprise reliability", icon: Wifi },
              { title: "Encryption", value: "AES-256", sub: "Military-grade security", icon: Lock },
              { title: "Support", value: "24/7", sub: "Expert assistance", icon: Users }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group">
                <item.icon className="w-8 h-8 text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold mb-2">{item.value}</div>
                <div className="text-sm font-bold text-slate-300 mb-1">{item.title}</div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Core Section */}
      <section className="py-24 bg-white text-slate-900">
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
                  <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
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

      {/* Workflow Automation Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "CRM Integration", desc: "Sync leads automatically", icon: Database },
                  { title: "Smart Routing", desc: "AI-based call distribution", icon: PhoneForwarded },
                  { title: "Team Insights", desc: "Real-time performance metrics", icon: BarChart2 },
                  { title: "Global Numbers", desc: "Local presence everywhere", icon: CloudLightning }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-900 transition-colors">
                      <item.icon className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-[10px] font-bold uppercase tracking-widest text-purple-600">
                <Zap className="w-3 h-3" />
                <span>Workflow Automation</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                Automate Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Sales Lifecycle</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Stop wasting time on manual data entry. Closo automates lead discovery, enrichment, and qualification, allowing your team to focus exclusively on closing high-value deals.
              </p>
              <ul className="space-y-4">
                {[
                  "Automated lead enrichment from 50+ sources",
                  "Intelligent follow-up scheduling",
                  "Real-time CRM synchronization",
                  "Customizable qualification workflows"
                ].map((point, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-emerald-600" />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white text-slate-900 overflow-hidden relative border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full -mr-48 -mt-48" />
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to scale your sales intelligence?</h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">Join 500+ enterprise teams using Closo to dominate their market with data-driven precision.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 px-10 h-14 text-base font-bold rounded-2xl transition-all hover:scale-105 active:scale-95" onClick={() => window.location.href='/dashboard'}>Get Started for Free</Button>
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/5 px-10 h-14 text-base font-bold rounded-2xl transition-all" onClick={() => setLocation("/demo")}>Talk to Sales</Button>
              </div>
            </div>
            <div className="relative z-10 hidden lg:block">
              <div className="w-64 h-64 border-4 border-white/10 rounded-full flex items-center justify-center animate-spin-slow">
                <div className="w-48 h-48 border-2 border-white/5 rounded-full flex items-center justify-center">
                  <img src={closoLogo} alt="Closo" className="h-10 brightness-0 invert opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Experience Section */}
      <section className="py-24 bg-slate-50 text-slate-900">
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

      {/* Monitoring Section */}
      <section className="py-24 bg-white">
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
