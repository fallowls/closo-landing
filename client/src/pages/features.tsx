import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PhoneCall,
  Mic,
  BarChart3,
  Users,
  Zap,
  MessageSquare,
  Database,
  Settings,
  Clock,
  Shield,
  Globe,
  Activity,
  FileText,
  TrendingUp,
  Headphones,
  Target,
  Radio,
  Volume2,
  Upload,
  Download,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import closoLogo from "@assets/closo_logo_png_1768558486274.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";
import { SEO } from "@/components/SEO";
import { useState, useEffect } from "react";

export default function Features() {
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: PhoneCall,
      title: "Smart Calling",
      description: "AI-powered calling with automatic recording and real-time transcription for better insights.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Mic,
      title: "Voice Recording",
      description: "Automatic call recording with cloud storage and instant playback access.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time dashboards with call metrics, performance tracking, and detailed reports.",
      gradient: "from-teal-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Contact Management",
      description: "Centralized contact database with custom fields, tags, and smart segmentation.",
      gradient: "from-orange-500 to-pink-500"
    },
    {
      icon: MessageSquare,
      title: "AI Chatbot",
      description: "Intelligent chatbot for lead scoring, contact analysis, and database queries.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Database,
      title: "CSV Import/Export",
      description: "Bulk import contacts via CSV and export your data anytime for backups.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Settings,
      title: "Workflow Automation",
      description: "Automate repetitive tasks with custom workflows and triggers.",
      gradient: "from-slate-600 to-slate-700"
    },
    {
      icon: Clock,
      title: "Call Scheduling",
      description: "Schedule calls with automatic reminders and timezone management.",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption, SOC 2 compliance, and advanced access controls.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: Globe,
      title: "Multi-Channel Support",
      description: "Voice, SMS, and email campaigns from a single unified platform.",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Live call monitoring with supervisor controls and quality assurance.",
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: FileText,
      title: "Smart Notes",
      description: "Collaborative notes with real-time sync and encryption for privacy.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Lead Scoring",
      description: "AI-powered lead scoring to prioritize high-value opportunities.",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      icon: Headphones,
      title: "Call Quality",
      description: "HD voice quality with noise cancellation and echo suppression.",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Campaign Manager",
      description: "Create and manage multi-touch campaigns with advanced targeting.",
      gradient: "from-orange-400 to-red-500"
    },
    {
      icon: Radio,
      title: "Live Streaming",
      description: "Stream calls and meetings with real-time collaboration features.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Volume2,
      title: "Voicemail Drop",
      description: "Pre-recorded voicemail messages for efficient outreach at scale.",
      gradient: "from-purple-600 to-indigo-600"
    },
    {
      icon: Upload,
      title: "Document Uploads",
      description: "Attach documents, images, and files to contacts and campaigns.",
      gradient: "from-emerald-500 to-green-600"
    },
    {
      icon: Download,
      title: "Data Export",
      description: "Export all your data in multiple formats for reporting and analysis.",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      icon: Zap,
      title: "API Integration",
      description: "RESTful API with webhooks for seamless third-party integrations.",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-purple-500/30 font-sans tracking-tight">
      <SEO 
        title="Parallel Dialer Features & Sales CRM Integration | Closo"
        description="Explore Closo's parallel dialer features with sales CRM integration. Auto dialer, AI calling, real-time analytics, call recording, and seamless CRM connectivity for sales teams."
      />

      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${showHeader ? 'py-3' : 'py-6'}`}>
        <div className="max-w-5xl mx-auto px-6">
          <div className={`flex items-center justify-between px-6 py-2 rounded-2xl border transition-all duration-500 ${showHeader ? 'bg-slate-900/90 backdrop-blur-md border-white/20 shadow-2xl' : 'bg-slate-900/40 border-white/10'}`}>
            <Link href="/">
              <img src={closoLogo} alt="Closo" className="h-7 brightness-0 invert cursor-pointer" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'About', 'Blog'].map(item => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm font-bold text-slate-100 hover:text-white transition-colors">{item}</Link>
              ))}
              <Button size="sm" className="bg-white hover:bg-slate-200 text-slate-950 rounded-lg px-5 h-9 font-extrabold shadow-xl" onClick={() => window.location.href='/dashboard'}>Dashboard</Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/30 text-[10px] font-extrabold uppercase tracking-widest text-purple-300 mb-8 animate-fade-in-down shadow-xl">
            <Zap className="w-3 h-3" />
            <span>Powerful Features</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            Everything You Need <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">to Excel</span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Comprehensive communication platform with AI-powered features designed to streamline your workflow and boost productivity.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white text-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="border-slate-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white group"
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-slate-900">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-950 text-white border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-blue-500/5 opacity-50" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white leading-tight">Ready to Transform Your Communication?</h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed font-medium">
            Join thousands of businesses using Closo to streamline their operations.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 px-10 h-14 text-base font-extrabold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.4)]" onClick={() => window.location.href='/demo'}>
              Book a Demo
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-white text-slate-950 bg-white hover:bg-slate-100 px-10 h-14 text-base font-extrabold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.4)]" onClick={() => window.location.href='/api-docs'}>
              Explore API
            </Button>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </div>
  );
}
