import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight,
  Sparkles,
  Phone,
  Zap,
  Shield,
  Mic,
  Rocket,
  Heart,
  Code,
  Users,
  Target,
  TrendingUp,
  PhoneCall,
  Database,
  Lock,
  Cpu
} from "lucide-react";
import { Link, useLocation } from "wouter";
import closoLogo from "../assets/closo_logo.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";
import { SEO } from "@/components/SEO";

export default function AboutUs() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [showHeader, setShowHeader] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Database,
      title: "Smart CRM",
      description: "Streamline your sales pipeline with our intelligent CRM system",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Target,
      title: "Intent Engine",
      description: "AI-powered intent detection to optimize your outreach",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      icon: Phone,
      title: "Closo Integration",
      description: "Seamless integration with Closo for reliable communications",
      gradient: "from-orange-400 to-pink-500"
    },
    {
      icon: Mic,
      title: "Programmable Voice",
      description: "Customize voice interactions with programmable controls",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Shield,
      title: "BYOC Dialer",
      description: "Bring Your Own Credentials for complete control",
      gradient: "from-teal-500 to-cyan-500"
    }
  ];

  const values = [
    {
      icon: Rocket,
      title: "Innovation First",
      description: "Constantly evolving to meet your business needs"
    },
    {
      icon: Heart,
      title: "User Focused",
      description: "Building tools that sales teams actually love to use"
    },
    {
      icon: Lock,
      title: "Security",
      description: "Your data security is our top priority"
    },
    {
      icon: Cpu,
      title: "Cutting Edge",
      description: "Leveraging the latest technology for best results"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-purple-500/30 font-sans tracking-tight">
      <SEO 
        title="About Closo - Dialer & Parallel Dialing Platform | Closo"
        description="Learn about Closo's enterprise dialer and parallel dialing platform. Innovative sales CRM integration, AI-powered calling, and voice API technology for sales teams."
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
            <Sparkles className="w-3 h-3" />
            <span>Under Active Development</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            About <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Closo</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Making sales and cold calling effortless with intelligent automation and seamless integrations
          </p>
        </div>
      </section>

      <section className="py-24 bg-white text-slate-900 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <Card className="border-slate-200 shadow-2xl bg-white overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-900 px-4 py-2 rounded-full">
                    <Code className="w-4 h-4" />
                    <span className="text-sm font-bold">Built by Amit Yadav</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                    A Solo Mission to Transform Cold Calling
                  </h2>
                  
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Closo is an individual venture, created with the vision of making sales and cold calling 
                    accessible, efficient, and powerful for businesses of all sizes.
                  </p>
                  
                  <p className="text-slate-600 leading-relaxed">
                    What started as a personal project has evolved into a comprehensive platform that 
                    combines cutting-edge technology with practical sales tools.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl blur-2xl opacity-20"></div>
                  <div className="relative bg-slate-900 rounded-2xl p-8 text-white shadow-2xl">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/60 font-bold uppercase tracking-widest">Company Structure</p>
                          <p className="font-extrabold text-lg">Solo Founded</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/60 font-bold uppercase tracking-widest">Current Status</p>
                          <p className="font-extrabold text-lg">Active Development</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/60 font-bold uppercase tracking-widest">Early Access</p>
                          <p className="font-extrabold text-lg">Currently Free</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-24 bg-slate-50 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                What We Offer
              </span>
            </h2>
            <p className="text-slate-600 text-lg font-medium">
              Comprehensive tools to supercharge your sales operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 bg-white"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-950 text-white relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-blue-500/5 opacity-50" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-6 py-2 rounded-full mb-8 border border-emerald-500/20 shadow-xl">
            <Sparkles className="w-5 h-5" />
            <span className="font-extrabold uppercase tracking-widest text-xs">Limited Time Offer</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">Currently Free to Use</h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed font-medium">
            We're in active development and offering Closo completely free while we refine the platform. 
            A small fee may be introduced in the future, but early users will receive special benefits.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              { icon: PhoneCall, label: "Unlimited Calls" },
              { icon: Database, label: "Full CRM Access" },
              { icon: Zap, label: "All Integrations" }
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3 text-slate-200 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <item.icon className="w-5 h-5 text-white" />
                <span className="text-sm font-bold">{item.label}</span>
              </div>
            ))}
          </div>
          
          <Button 
            size="lg" 
            className="bg-white text-slate-950 hover:bg-slate-100 px-12 h-16 text-lg font-extrabold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            onClick={() => window.location.href='/demo'}
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-3" />
          </Button>
        </div>
      </section>

      <EnterpriseFooter />
    </div>
  );
}
