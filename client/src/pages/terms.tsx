import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Scale, 
  AlertCircle, 
  CheckCircle, 
  UserX,
  CreditCard,
  RefreshCw,
  Shield,
  Mail,
  Activity
} from "lucide-react";
import { Link, useLocation } from "wouter";
import closoLogo from "../assets/closo_logo.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";
import { SEO } from "@/components/SEO";

export default function Terms() {
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
        title="Terms of Service | Closo"
        description="Please read our terms of service carefully before using Closo. We maintain clear, fair, and transparent usage policies for all users."
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
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Service</span>
          </h1>
          <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed font-medium">
            Please read these terms carefully before using Closo services.
          </p>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            Last updated: October 2, 2025
          </p>
        </div>
      </section>

      <section className="py-24 bg-white text-slate-900 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {[
              { icon: FileText, title: "Clear Agreement", desc: "Simple, straightforward terms with no hidden clauses or surprises.", gradient: "from-purple-500 to-purple-600" },
              { icon: Shield, title: "Fair Usage", desc: "Reasonable usage policies that protect all users equally.", gradient: "from-blue-500 to-cyan-500" },
              { icon: RefreshCw, title: "Regular Updates", desc: "We keep you informed of any changes to our terms.", gradient: "from-orange-400 to-pink-500" }
            ].map((item, i) => (
              <Card key={i} className="border-slate-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-xl`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-extrabold text-xl mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto space-y-20">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight">Agreement to Terms</h2>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                By accessing and using Closo services, you accept and agree to be bound by the terms and provision 
                of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
              <Card className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                <div className="flex items-start gap-4 relative z-10">
                  <AlertCircle className="w-8 h-8 text-purple-400 shrink-0 mt-1" />
                  <div>
                    <p className="text-xl font-black uppercase tracking-tight mb-4">Important Notice</p>
                    <p className="text-slate-300 font-medium leading-relaxed">
                      These terms constitute a legally binding agreement between you and Closo. 
                      Please read them carefully and retain a copy for your records.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight">Billing & Payment</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  { title: "Subscriptions", desc: "Subscriptions are billed monthly or annually. Auto-renewal applies unless canceled.", icon: RefreshCw },
                  { title: "Usage Charges", desc: "Additional charges may apply for usage beyond plan limits like international calls.", icon: Activity }
                ].map((item, i) => (
                  <Card key={i} className="border-slate-200 shadow-xl rounded-[2rem] bg-slate-50">
                    <CardContent className="p-8">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-sm">
                        <item.icon className="w-6 h-6 text-slate-900" />
                      </div>
                      <h3 className="font-black text-lg mb-3 uppercase tracking-tight">{item.title}</h3>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
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
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">Questions About Terms?</h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed font-medium">
            If you have any questions or concerns about our terms of service, please contact our legal team.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-slate-950 hover:bg-slate-100 px-12 h-16 text-lg font-extrabold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            onClick={() => window.location.href='mailto:legal@closo.com'}
          >
            Email Legal Team
          </Button>
        </div>
      </section>

      <EnterpriseFooter />
    </div>
  );
}
