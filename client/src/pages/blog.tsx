import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { 
  Search, 
  Calendar, 
  Clock,
  ArrowRight,
  TrendingUp,
  Phone,
  Zap,
  BarChart3,
  Shield,
  Users,
  Rocket,
  Settings,
  Target,
  Headphones,
  Database,
  Globe,
  GitBranch
} from "lucide-react";
import closoLogo from "../assets/closo_logo.png";
import { EnterpriseFooter } from "@/components/EnterpriseFooter";

const blogPosts = [
  {
    id: 1,
    slug: "benefits-of-parallel-dialers",
    title: "Benefits of Parallel Dialers for Sales Teams",
    excerpt: "Discover how parallel dialers can increase your team's productivity by 4x and transform your outbound sales strategy.",
    category: "Sales Technology",
    author: "Sarah Mitchell",
    date: "October 10, 2025",
    readTime: "8 min read",
    image: TrendingUp,
    gradient: "from-purple-500 to-purple-600"
  },
  {
    id: 2,
    slug: "power-dialer-vs-parallel-dialer",
    title: "Power Dialer vs Parallel Dialer: Which is Right for You?",
    excerpt: "A comprehensive comparison of power dialers and parallel dialers to help you choose the best solution for your sales team.",
    category: "Comparison",
    author: "Michael Chen",
    date: "October 8, 2025",
    readTime: "10 min read",
    image: BarChart3,
    gradient: "from-teal-500 to-cyan-500"
  },
  {
    id: 3,
    slug: "choosing-right-auto-dialer",
    title: "How to Choose the Right Auto Dialer for Your Business",
    excerpt: "Learn about different types of auto dialers and how to select the perfect one based on your business needs and goals.",
    category: "Guide",
    author: "Emily Rodriguez",
    date: "October 5, 2025",
    readTime: "12 min read",
    image: Zap,
    gradient: "from-orange-400 to-pink-500"
  },
  {
    id: 4,
    slug: "sales-automation-integration",
    title: "Complete Guide to Integration with Sales CRM",
    excerpt: "Step-by-step tutorial on integrating your sales CRM for seamless calling, SMS, and customer communication automation.",
    category: "Integration",
    author: "David Kumar",
    date: "October 15, 2025",
    readTime: "15 min read",
    image: GitBranch,
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    id: 5,
    slug: "sales-automation-best-practices",
    title: "Sales Automation Best Practices with Parallel Dialers",
    excerpt: "Master sales automation with parallel dialing technology. Learn proven strategies to increase conversion rates and reduce manual work.",
    category: "Best Practices",
    author: "Jennifer Parks",
    date: "October 12, 2025",
    readTime: "9 min read",
    image: Rocket,
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    id: 6,
    slug: "api-advanced-features",
    title: "Advanced API Features for Sales Teams",
    excerpt: "Unlock the full potential of our API with advanced features like call recording, transcription, and analytics integration.",
    category: "Technical",
    author: "Alex Thompson",
    date: "October 9, 2025",
    readTime: "11 min read",
    image: Settings,
    gradient: "from-violet-500 to-purple-600"
  },
  {
    id: 7,
    slug: "crm-dialer-roi-calculator",
    title: "Calculating ROI: CRM Dialer Investment Guide",
    excerpt: "Learn how to calculate the return on investment for your CRM dialer implementation and justify the cost to stakeholders.",
    category: "Business",
    author: "Rachel Martinez",
    date: "October 7, 2025",
    readTime: "7 min read",
    image: Target,
    gradient: "from-amber-500 to-orange-600"
  },
  {
    id: 8,
    slug: "predictive-dialer-vs-auto-dialer",
    title: "Predictive Dialer vs Auto Dialer: Key Differences",
    excerpt: "Understand the critical differences between predictive dialers and auto dialers to make the right choice for your outbound sales.",
    category: "Comparison",
    author: "Marcus Johnson",
    date: "October 4, 2025",
    readTime: "8 min read",
    image: BarChart3,
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    id: 9,
    slug: "outbound-sales-call-scripts",
    title: "Effective Outbound Sales Call Scripts for Parallel Dialing",
    excerpt: "Proven call scripts and templates optimized for parallel dialing campaigns that convert prospects into customers.",
    category: "Scripts",
    author: "Lisa Anderson",
    date: "October 3, 2025",
    readTime: "10 min read",
    image: Headphones,
    gradient: "from-pink-500 to-rose-600"
  },
  {
    id: 10,
    slug: "compliance-tcpa-auto-dialing",
    title: "TCPA Compliance Guide for Auto Dialing",
    excerpt: "Essential TCPA compliance requirements for auto dialers and parallel dialers to avoid legal issues and penalties.",
    category: "Compliance",
    author: "Robert Chen",
    date: "October 2, 2025",
    readTime: "13 min read",
    image: Shield,
    gradient: "from-red-500 to-pink-600"
  },
  {
    id: 11,
    slug: "sales-team-training-dialer",
    title: "Training Your Sales Team on Auto Dialer Software",
    excerpt: "Best practices for onboarding and training your sales team to maximize productivity with auto dialer technology.",
    category: "Training",
    author: "Jessica Taylor",
    date: "October 1, 2025",
    readTime: "9 min read",
    image: Users,
    gradient: "from-indigo-500 to-purple-600"
  },
  {
    id: 12,
    slug: "cloud-based-dialer-advantages",
    title: "Why Cloud-Based Dialers Are the Future of Sales",
    excerpt: "Explore the advantages of cloud-based dialers over traditional on-premise solutions for modern sales teams.",
    category: "Technology",
    author: "Daniel Lee",
    date: "September 30, 2025",
    readTime: "11 min read",
    image: Globe,
    gradient: "from-sky-500 to-blue-600"
  },
  {
    id: 13,
    slug: "crm-data-management-dialers",
    title: "CRM Data Management for Dialer Campaigns",
    excerpt: "Master CRM data management strategies to improve dialer campaign performance and maintain data quality.",
    category: "Data Management",
    author: "Sophia Williams",
    date: "September 28, 2025",
    readTime: "8 min read",
    image: Database,
    gradient: "from-teal-500 to-emerald-600"
  },
  {
    id: 14,
    slug: "ai-powered-dialing-strategies",
    title: "AI-Powered Dialing: The Next Generation of Sales Automation",
    excerpt: "Discover how AI is revolutionizing auto dialers with intelligent call routing, predictive analytics, and personalized outreach.",
    category: "AI & Innovation",
    author: "Kevin Patel",
    date: "September 26, 2025",
    readTime: "12 min read",
    image: Rocket,
    gradient: "from-purple-600 to-pink-600"
  },
  {
    id: 15,
    slug: "voice-quality-optimization",
    title: "Optimizing Voice Quality for Crystal-Clear Calls",
    excerpt: "Technical guide to optimizing voice quality, reducing latency, and ensuring HD audio for professional sales calls.",
    category: "Technical",
    author: "Nathan Rodriguez",
    date: "September 25, 2025",
    readTime: "10 min read",
    image: Phone,
    gradient: "from-orange-500 to-red-600"
  },
];

export default function Blog() {
  const [showHeader, setShowHeader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-purple-500/30 font-sans tracking-tight">
      <SEO 
        title="Dialer & Parallel Dialing Blog - Sales CRM Insights | Closo"
        description="Expert insights on dialers, parallel dialing, and sales CRM integration. Learn best practices for auto dialers, sales automation, and maximizing team productivity."
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
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            Closo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Blog</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            Insights, guides, and best practices for modern sales teams using dialers and communication technology
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-white/10 border-white/20 rounded-2xl text-base text-white placeholder-slate-400 focus:border-purple-500 backdrop-blur-sm shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white text-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-slate-500 font-bold">No articles found matching your search.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => {
                const IconComponent = post.image;
                return (
                  <Card 
                    key={post.id} 
                    className="bg-white border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group overflow-hidden"
                    onClick={() => setLocation(`/blog/${post.slug}`)}
                  >
                    <CardContent className="p-0">
                      <div className={`bg-gradient-to-br ${post.gradient} p-8 flex items-center justify-center h-48 shadow-inner`}>
                        <IconComponent className="w-20 h-20 text-white group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs font-black text-purple-600 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-widest">
                            {post.category}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-slate-600 text-sm mb-6 line-clamp-3 font-medium">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                          <span className="text-sm text-slate-900 font-black">{post.author}</span>
                          <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-slate-950 text-white relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-blue-500/5 opacity-50" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <Phone className="w-16 h-16 mx-auto mb-8 text-purple-400 animate-pulse" />
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">Ready to Transform Your Sales Process?</h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed font-medium">
            Start using Closo's powerful dialing technology to increase your team's productivity and close more deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-white text-slate-950 hover:bg-slate-100 px-12 h-16 text-lg font-extrabold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
              onClick={() => setLocation("/demo")}
            >
              Book a Demo
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-slate-950 bg-white hover:bg-slate-100 px-12 h-16 text-lg font-extrabold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
              onClick={() => window.location.href='/dashboard'}
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </div>
  );
}
