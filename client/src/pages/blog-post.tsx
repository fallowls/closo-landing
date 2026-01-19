import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { 
  Calendar, 
  Clock, 
  ArrowLeft,
  Share2,
  TrendingUp,
  Phone,
  Zap,
  BarChart3,
  CheckCircle,
  Users,
  Target,
  DollarSign,
  Activity
} from "lucide-react";
import closoLogo from "@assets/closo_logo_png_1768558486274.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";
import { Link } from "wouter";

const blogContent: Record<string, any> = {
  "benefits-of-parallel-dialers": {
    title: "Benefits of Parallel Dialers for Sales Teams",
    category: "Sales Technology",
    author: "Sarah Mitchell",
    date: "October 10, 2025",
    readTime: "8 min read",
    icon: TrendingUp,
    gradient: "from-purple-500 to-purple-600",
    content: {
      intro: "In today's competitive sales environment, productivity is everything. Parallel dialers have emerged as a game-changing technology that can increase your team's call volume by up to 4x while maintaining quality conversations. Let's explore how this powerful tool can transform your outbound sales strategy.",
      sections: [
        {
          title: "What is a Parallel Dialer?",
          content: "A parallel dialer is an automated outbound calling system that dials multiple phone numbers simultaneously for each sales agent. When a live person answers, the system instantly connects them to an available agent. It's designed to maximize productivity by eliminating idle time between calls.",
          icon: Phone,
          keyPoints: [
            "Dials 2-10 numbers simultaneously per agent",
            "AI-powered answer detection filters out voicemails and busy signals",
            "Instant connection when live person answers",
            "Continuous automated dialing until list completion"
          ]
        },
        {
          title: "Massive Productivity Gains",
          content: "The most significant advantage of parallel dialers is the dramatic increase in productive talk time. While manual dialing gives reps only 10-15 minutes of actual conversation per hour, parallel dialers can increase this to 40-50 minutes per hour.",
          icon: TrendingUp,
          stats: [
            { label: "Talk Time Increase", value: "300%", color: "text-purple-600" },
            { label: "More Prospects Reached", value: "4x", color: "text-blue-600" },
            { label: "Idle Time Reduction", value: "80%", color: "text-orange-600" }
          ]
        },
        {
          title: "Key Benefits",
          content: "Parallel dialers offer numerous advantages that directly impact your bottom line:",
          icon: CheckCircle,
          benefits: [
            {
              title: "Higher Connect Rates",
              description: "More simultaneous calls mean higher probability of live connections. Your agents spend time in actual conversations, not waiting for rings."
            },
            {
              title: "Time Optimization",
              description: "Eliminates manual dialing, number lookup, and hang-up delays. Automatically handles busy signals, voicemails, and disconnected numbers."
            },
            {
              title: "Improved Agent Morale",
              description: "Less frustration from endless ringing and voicemails means more time closing deals, leading to higher motivation and less burnout."
            },
            {
              title: "Cost-Effective Scaling",
              description: "Cloud-based systems scale instantly without additional hardware. Reach more prospects without hiring additional staff."
            },
            {
              title: "Data-Driven Insights",
              description: "Real-time dashboards track KPIs like calls made, talk time, and conversion rates. Machine learning refines dialing strategies over time."
            }
          ]
        }
      ],
      conclusion: "Parallel dialers represent a significant leap forward in sales productivity technology. By maximizing talk time and minimizing idle periods, they enable teams to reach 4x more prospects while maintaining conversation quality. For organizations running high-volume outbound campaigns, the ROI is clear: more conversations, faster pipeline generation, and improved team morale."
    }
  }
};

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const [, setLocation] = useLocation();
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const post = params?.slug ? blogContent[params.slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-black">Post not found</h1>
          <Button onClick={() => setLocation("/blog")} className="bg-white text-slate-950 font-black px-8 h-12 rounded-xl">
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = post.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-purple-500/30 font-sans tracking-tight">
      <SEO title={`${post.title} | Closo Blog`} description={post.content.intro} />

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

      <article className="relative pt-40 pb-24 z-10">
        <div className="max-w-4xl mx-auto px-6">
          <Button 
            variant="ghost" 
            className="mb-12 text-slate-400 hover:text-white transition-colors group flex items-center gap-2"
            onClick={() => setLocation("/blog")}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-black text-purple-400 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-white">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400 mb-16 pb-8 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-white">
                {post.author[0]}
              </div>
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="space-y-12">
            <div className={`bg-gradient-to-br ${post.gradient} rounded-[3rem] p-12 md:p-24 flex items-center justify-center shadow-2xl`}>
              <IconComponent className="w-32 h-32 md:w-48 md:h-48 text-white animate-pulse" />
            </div>

            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-xl md:text-2xl text-slate-100 font-bold leading-relaxed mb-16 italic opacity-90">
                {post.content.intro}
              </p>

              {post.content.sections.map((section: any, idx: number) => {
                const SectionIcon = section.icon;
                return (
                  <div key={idx} className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-xl">
                        <SectionIcon className="w-6 h-6 text-purple-400" />
                      </div>
                      <h2 className="text-3xl font-black text-white m-0 uppercase tracking-tight">{section.title}</h2>
                    </div>
                    
                    <p className="text-lg text-slate-300 leading-relaxed mb-10 font-medium">
                      {section.content}
                    </p>

                    {section.stats && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {section.stats.map((stat: any, sIdx: number) => (
                          <Card key={sIdx} className="bg-white/5 border-white/10 shadow-2xl rounded-[2rem]">
                            <CardContent className="p-8 text-center">
                              <div className={`text-4xl font-black mb-2 ${stat.color.replace('text-', 'text-')}`}>{stat.value}</div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {section.keyPoints && (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 m-0 p-0 list-none mb-12">
                        {section.keyPoints.map((point: string, pIdx: number) => (
                          <li key={pIdx} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4 shadow-xl">
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-sm font-bold text-slate-200">{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.benefits && (
                      <div className="grid grid-cols-1 gap-4 mb-12">
                        {section.benefits.map((benefit: any, bIdx: number) => (
                          <div key={bIdx} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors shadow-xl">
                            <h4 className="text-xl font-black text-white mb-2">{benefit.title}</h4>
                            <p className="text-sm text-slate-300 m-0 font-medium">{benefit.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 md:p-16 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                <h2 className="text-3xl font-black text-white mb-6 m-0 uppercase tracking-tight">Conclusion</h2>
                <p className="text-lg text-slate-200 m-0 font-bold leading-relaxed">
                  {post.conclusion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <EnterpriseFooter />
    </div>
  );
}
