import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileCheck, 
  Globe, 
  Building,
  CheckCircle,
  Award,
  Lock,
  Scale,
  Users,
  Mail,
  Shield
} from "lucide-react";
import { Link, useLocation } from "wouter";
import closoLogo from "@assets/closo_logo_png_1768558486274.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";
import { SEO } from "@/components/SEO";

export default function Compliance() {
  const [showHeader, setShowHeader] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-purple-500/30 font-sans tracking-tight">
      <SEO 
        title="Compliance & Standards | Closo"
        description="Closo meets the highest industry standards for data protection and regulatory compliance including GDPR, SOC 2, and HIPAA."
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 border border-white/20 rounded-[2rem] mb-8 shadow-2xl backdrop-blur-md">
            <FileCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            Compliance & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Standards</span>
          </h1>
          <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed font-medium">
            Meeting the highest industry standards for data protection and regulatory compliance.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white text-slate-900 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16 uppercase tracking-tight">Our Certifications</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {[
              { icon: Award, title: "SOC 2 Type II", desc: "Comprehensive audit of security, availability, and privacy.", gradient: "from-purple-500 to-purple-600" },
              { icon: Shield, title: "ISO 27001", desc: "International standard for information security management.", gradient: "from-blue-500 to-cyan-500" },
              { icon: Lock, title: "HIPAA Compliant", desc: "Secure handling of protected health information.", gradient: "from-orange-400 to-pink-500" }
            ].map((item, i) => (
              <Card key={i} className="border-slate-200 shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-xl`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-extrabold text-xl mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">{item.desc}</p>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Verified 2024
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto space-y-20">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight">Global Regulations</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full -mr-24 -mt-24" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4">GDPR</h3>
                    <p className="text-slate-400 font-medium mb-8 leading-relaxed">Full compliance with EU General Data Protection Regulation.</p>
                    <ul className="space-y-3">
                      {["Data portability", "Right to erasure", "Breach notification"].map((t, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-200">
                          <CheckCircle className="w-4 h-4 text-purple-400" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
                <Card className="bg-slate-50 border-slate-200 rounded-[3rem] p-10 shadow-xl">
                  <Scale className="w-12 h-12 text-slate-900 mb-6" />
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-slate-900">CCPA</h3>
                  <p className="text-slate-600 font-medium mb-8 leading-relaxed">California Consumer Privacy Act compliance for residents.</p>
                  <ul className="space-y-3">
                    {["Right to know", "Right to delete", "Opt-out options"].map((t, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-900">
                        <CheckCircle className="w-4 h-4 text-teal-600" /> {t}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-950 text-white relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-blue-500/5 opacity-50" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl backdrop-blur-md border border-white/20">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">Compliance Questions?</h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed font-medium">
            Our compliance team is here to help with documentation and standards inquiries.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-slate-950 hover:bg-slate-100 px-12 h-16 text-lg font-extrabold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            onClick={() => window.location.href='mailto:compliance@closo.com'}
          >
            Email Compliance Team
          </Button>
        </div>
      </section>

      <EnterpriseFooter />
    </div>
  );
}
